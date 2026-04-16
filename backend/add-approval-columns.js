const mysql = require('mysql2');
require('dotenv').config();

async function addApprovalColumns() {
  console.log('Adding multi-level approval columns...');
  
  const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true },
    multipleStatements: true
  });

  const sql = 
    -- Add approval tracking columns
    ALTER TABLE clearance_requests 
    ADD COLUMN IF NOT EXISTS manager_approved BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS manager_review_note TEXT,
    ADD COLUMN IF NOT EXISTS manager_approved_at TIMESTAMP NULL,
    
    ADD COLUMN IF NOT EXISTS hr_approved BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS hr_review_note TEXT,
    ADD COLUMN IF NOT EXISTS hr_approved_at TIMESTAMP NULL,
    
    ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS admin_review_note TEXT,
    ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP NULL,
    
    ADD COLUMN IF NOT EXISTS approval_level ENUM('manager','hr','admin','completed') DEFAULT 'manager';
  ;

  connection.query(sql, (err) => {
    if (err) console.error('Error:', err);
    else console.log('✅ Multi-level approval columns added!');
    connection.end();
  });
}

addApprovalColumns();
