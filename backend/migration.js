const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: { rejectUnauthorized: true }
});

const sql = \
  -- Add approval level tracking columns
  ALTER TABLE clearance_requests 
  ADD COLUMN IF NOT EXISTS approval_status ENUM('pending_manager', 'pending_hr', 'pending_admin', 'approved', 'rejected') DEFAULT 'pending_manager',
  ADD COLUMN IF NOT EXISTS manager_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS manager_review_note TEXT,
  ADD COLUMN IF NOT EXISTS manager_approved_at TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS hr_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS hr_review_note TEXT,
  ADD COLUMN IF NOT EXISTS hr_approved_at TIMESTAMP NULL,
  ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS admin_review_note TEXT,
  ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP NULL;
\;

conn.query(sql, (err) => {
  if (err) console.error('Error:', err);
  else console.log('✅ Multi-level approval columns added!');
  conn.end();
});
