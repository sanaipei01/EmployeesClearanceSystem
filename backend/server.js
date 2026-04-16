const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const email = require('./emailService');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection pool
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecs_db',
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  ssl: { rejectUnauthorized: true },
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

// JWT Middleware
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

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
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

// Get all requests (Admin & HR)
app.get('/api/requests', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT cr.*, e.name AS employee_name, e.department
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      ORDER BY cr.created_at DESC
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get my requests (Employee)
app.get('/api/requests/my', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT cr.*, e.name AS employee_name
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      WHERE e.user_id = ?
      ORDER BY cr.created_at DESC
    , [req.user.id]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get team requests (Manager)
app.get('/api/requests/team', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query(
      SELECT cr.*, e.name AS employee_name, e.department
      FROM clearance_requests cr
      JOIN employees e ON cr.employee_id = e.id
      ORDER BY cr.created_at DESC
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Submit new request
app.post('/api/requests', authMiddleware, async (req, res) => {
  try {
    const { type, reason, urgency } = req.body;
    const [empRows] = await db.query('SELECT id FROM employees WHERE user_id = ?', [req.user.id]);
    if (empRows.length === 0) return res.status(404).json({ error: 'Employee record not found' });

    const employeeId = empRows[0].id;
    const requestNo = REQ-;

    await db.query(
      INSERT INTO clearance_requests (request_no, employee_id, type, reason, urgency, approval_level)
      VALUES (?, ?, ?, ?, ?, 'manager')
    , [requestNo, employeeId, type, reason, urgency || 'normal']);

    res.json({ message: 'Request submitted successfully', request_no: requestNo });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// MULTI-LEVEL APPROVAL ENDPOINT (Manager -> HR -> Admin with Certificate)
app.patch('/api/requests/:id/approve', authMiddleware, async (req, res) => {
  try {
    const { action, review_note } = req.body;
    const userRole = req.user.role;
    const requestId = req.params.id;
    
    const [requests] = await db.query('SELECT * FROM clearance_requests WHERE id = ?', [requestId]);
    if (requests.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    
    const request = requests[0];
    let currentLevel = request.approval_level || 'manager';
    let newLevel = currentLevel;
    let updateFields = {};
    
    if (userRole === 'manager' && currentLevel === 'manager') {
      updateFields.manager_approved = action === 'approve';
      updateFields.manager_approved_at = new Date();
      newLevel = action === 'approve' ? 'hr' : 'rejected';
    }
    else if (userRole === 'hr' && currentLevel === 'hr') {
      updateFields.hr_approved = action === 'approve';
      updateFields.hr_approved_at = new Date();
      newLevel = action === 'approve' ? 'admin' : 'rejected';
    }
    else if (userRole === 'admin' && currentLevel === 'admin') {
      updateFields.admin_approved = action === 'approve';
      updateFields.admin_approved_at = new Date();
      newLevel = action === 'approve' ? 'completed' : 'rejected';
      
      if (action === 'approve') {
        const certificateNumber = 'CERT-' + Date.now() + '-' + requestId;
        const certificateUrl = https://employeesclearancesystem.onrender.com/certificates/;
        updateFields.certificate_url = certificateUrl;
        updateFields.certificate_generated_at = new Date();
        updateFields.completed_at = new Date();
      }
    }
    else {
      return res.status(403).json({ 
        error: Not authorized. Current level: , Your role:  
      });
    }
    
    await db.query(
      UPDATE clearance_requests 
      SET approval_level = ?,
          status = ?,
          manager_approved = ?,
          manager_approved_at = ?,
          hr_approved = ?,
          hr_approved_at = ?,
          admin_approved = ?,
          admin_approved_at = ?,
          certificate_url = ?,
          certificate_generated_at = ?,
          completed_at = ?,
          review_note = ?
      WHERE id = ?
    , [
      newLevel,
      newLevel === 'completed' ? 'approved' : (newLevel === 'rejected' ? 'rejected' : 'pending'),
      updateFields.manager_approved || false,
      updateFields.manager_approved_at || null,
      updateFields.hr_approved || false,
      updateFields.hr_approved_at || null,
      updateFields.admin_approved || false,
      updateFields.admin_approved_at || null,
      updateFields.certificate_url || null,
      updateFields.certificate_generated_at || null,
      updateFields.completed_at || null,
      review_note || '',
      requestId
    ]);
    
    const response = {
      message: Request d by ,
      current_level: newLevel,
      next_role: newLevel === 'hr' ? 'HR' : (newLevel === 'admin' ? 'Admin' : (newLevel === 'completed' ? 'Complete - Certificate Generated' : 'Rejected'))
    };
    
    if (updateFields.certificate_url) {
      response.certificate_url = updateFields.certificate_url;
      response.certificate_number = updateFields.certificate_url.split('/').pop();
    }
    
    res.json(response);
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get employees
app.get('/api/employees', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM employees ORDER BY name');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Stats endpoint
app.get('/api/stats', authMiddleware, async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) AS total FROM clearance_requests');
    const [[{ pending }]] = await db.query("SELECT COUNT(*) AS pending FROM clearance_requests WHERE status='pending'");
    const [[{ approved }]] = await db.query("SELECT COUNT(*) AS approved FROM clearance_requests WHERE status='approved'");
    const [[{ rejected }]] = await db.query("SELECT COUNT(*) AS rejected FROM clearance_requests WHERE status='rejected'");
    const [[{ employees }]] = await db.query('SELECT COUNT(*) AS employees FROM employees');
    res.json({ total, pending, approved, rejected, employees });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Feedback endpoints
app.post('/api/feedback', authMiddleware, async (req, res) => {
  try {
    const { category, rating, comment, suggestion, anonymous } = req.body;
    await db.query(
      INSERT INTO feedback (submitted_by, role, category, rating, comment, suggestion, anonymous)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    , [anonymous ? 'Anonymous' : req.user.name, req.user.role, category, rating, comment, suggestion || '', anonymous]);
    res.json({ message: 'Feedback submitted!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/feedback', authMiddleware, async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM feedback ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'ECS Backend API', version: '2.0', endpoints: ['/api/auth/login', '/api/requests', '/api/stats'] });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(🚀 ECS Backend running on port );
  console.log(📋 API ready at http://localhost:/api);
});
