const express  = require('express');
const cors     = require('cors');
const mysql    = require('mysql2/promise');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
require('dotenv').config();
const email = require('./emailService');

const app  = express();
app.use(cors());
app.use(express.json());

// ─── DB CONNECTION ───────────────────────────────────────────
const db = mysql.createPool({
  host:     process.env.DB_HOST     || 'localhost',
  user:     process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME     || 'ecs_db',
  waitForConnections: true,
  connectionLimit:    10,
});

// Test DB connection on startup
db.getConnection()
  .then(conn => {
    console.log('✅ MySQL connected successfully!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ MySQL connection failed:', err.message);
  });

// ─── JWT MIDDLEWARE ──────────────────────────────────────────
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'REMOVED');
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// ─── AUTH ROUTES ─────────────────────────────────────────────

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'REMOVED',
      { expiresIn: '8h' }
    );

    res.json({
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ─── REQUESTS ROUTES ─────────────────────────────────────────

// GET /api/requests — all requests (admin & hr)
app.get('/api/requests', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cr.*, e.name AS employee_name, e.department
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      ORDER BY cr.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/my — logged in employee's requests
app.get('/api/requests/my', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cr.*, e.name AS employee_name
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      WHERE e.user_id = ?
      ORDER BY cr.created_at DESC
    `, [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/requests/team — manager's team requests
app.get('/api/requests/team', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cr.*, e.name AS employee_name, e.department
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      ORDER BY cr.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/requests — submit new request
app.post('/api/requests', authMiddleware, async (req, res) => {
  try {
    const { type, reason, urgency } = req.body;
    // Get employee record for this user
    const [empRows] = await db.query('SELECT id FROM employees WHERE user_id = ?', [req.user.id]);
    if (empRows.length === 0) return res.status(404).json({ error: 'Employee record not found' });

    const employeeId = empRows[0].id;
    const requestNo  = `REQ-${Date.now().toString().slice(-6)}`;

    await db.query(`
      INSERT INTO clearance_requests (request_no, employee_id, type, reason, urgency)
      VALUES (?, ?, ?, ?, ?)
    `, [requestNo, employeeId, type, reason, urgency || 'normal']);

    // Send emails (non-blocking)
    try {
      const [empData] = await db.query(`
        SELECT e.*, u.name, u.username FROM employees e
        JOIN users u ON e.user_id = u.id WHERE e.id = ?
      `, [employeeId]);
      const empEmail = empData[0]?.email || '';
      const empName  = empData[0]?.name  || 'Employee';

      // Email to employee confirming submission
      if (empEmail) email.sendRequestSubmitted(empEmail, empName, type, requestNo);

      // Email to HR about new request
      const HR_EMAIL = process.env.HR_EMAIL || '';
      if (HR_EMAIL) email.sendNewRequestToHR(HR_EMAIL, empName, type, requestNo, urgency || 'normal');
    } catch (emailErr) {
      console.error('Email error (non-fatal):', emailErr.message);
    }

    res.json({ message: 'Request submitted successfully', request_no: requestNo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PATCH /api/requests/:id/status — approve or reject
app.patch('/api/requests/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status, review_note } = req.body;
    await db.query(`
      UPDATE clearance_requests
      SET status = ?, reviewed_by = ?, review_note = ?
      WHERE id = ?
    `, [status, req.user.id, review_note || '', req.params.id]);
    // Send email notification to employee
    try {
      const [reqData] = await db.query(`
        SELECT cr.*, e.email, u.name, u.username
        FROM clearance_requests cr
        JOIN employees e ON cr.employee_id = e.id
        JOIN users u ON e.user_id = u.id
        WHERE cr.id = ?
      `, [req.params.id]);
      if (reqData.length > 0) {
        const r = reqData[0];
        if (r.email) {
          if (status === 'approved') {
            email.sendRequestApproved(r.email, r.name, r.type, r.request_no);
          } else if (status === 'rejected') {
            email.sendRequestRejected(r.email, r.name, r.type, r.request_no, review_note);
          }
        }
      }
    } catch (emailErr) {
      console.error('Email error (non-fatal):', emailErr.message);
    }

    res.json({ message: `Request ${status} successfully` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── EMPLOYEES ROUTES ─────────────────────────────────────────

// GET /api/employees
app.get('/api/employees', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/employees — add new employee
app.post('/api/employees', authMiddleware, async (req, res) => {
  try {
    const { name, email, department, role } = req.body;
    await db.query(
      'INSERT INTO employees (name, email, department, role) VALUES (?, ?, ?, ?)',
      [name, email, department, role]
    );
    res.json({ message: 'Employee added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── STATS ROUTE ──────────────────────────────────────────────

// GET /api/stats
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const [[{ total }]]      = await db.query('SELECT COUNT(*) AS total FROM clearance_requests');
    const [[{ pending }]]    = await db.query("SELECT COUNT(*) AS pending FROM clearance_requests WHERE status='pending'");
    const [[{ approved }]]   = await db.query("SELECT COUNT(*) AS approved FROM clearance_requests WHERE status='approved'");
    const [[{ rejected }]]   = await db.query("SELECT COUNT(*) AS rejected FROM clearance_requests WHERE status='rejected'");
    const [[{ employees }]]  = await db.query('SELECT COUNT(*) AS employees FROM employees');

    res.json({ total, pending, approved, rejected, employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── FEEDBACK ROUTE ───────────────────────────────────────────

// POST /api/feedback
app.post('/api/feedback', authMiddleware, async (req, res) => {
  try {
    const { category, rating, comment, suggestion, anonymous } = req.body;
    const user = req.user;
    await db.query(`
      INSERT INTO feedback (submitted_by, role, category, rating, comment, suggestion, anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [anonymous ? 'Anonymous' : user.name, user.role, category, rating, comment, suggestion || '', anonymous]);
    res.json({ message: 'Feedback submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/feedback
app.get('/api/feedback', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─── START SERVER ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ECS Backend running on http://localhost:${PORT}`);
  console.log(`📋 API ready at http://localhost:${PORT}/api`);
});