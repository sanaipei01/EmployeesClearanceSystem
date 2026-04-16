const mysql = require('mysql2');
require('dotenv').config();

async function runMigration() {
  console.log('Running multi-level approval migration...');
  
  const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true }
  });

  const sqls = [
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS approval_status VARCHAR(50) DEFAULT 'pending_manager',
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS manager_approved BOOLEAN DEFAULT FALSE,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS manager_review_note TEXT,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS manager_approved_at TIMESTAMP NULL,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS hr_approved BOOLEAN DEFAULT FALSE,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS hr_review_note TEXT,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS hr_approved_at TIMESTAMP NULL,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS admin_approved BOOLEAN DEFAULT FALSE,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS admin_review_note TEXT,
     
    ALTER TABLE clearance_requests 
     ADD COLUMN IF NOT EXISTS admin_approved_at TIMESTAMP NULL
  ];

  for (const sql of sqls) {
    try {
      await conn.promise().query(sql);
      console.log('✅ Column added/verified');
    } catch (err) {
      console.log('Note:', err.message);
    }
  }
  
  // Update existing records
  await conn.promise().query(
    UPDATE clearance_requests 
    SET approval_status = 'pending_manager' 
    WHERE approval_status IS NULL
  );
  
  console.log('✅ Migration complete!');
  conn.end();
}

runMigration().catch(console.error);
