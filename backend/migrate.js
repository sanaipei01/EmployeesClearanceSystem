const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function migrate() {
  console.log('🔄 Connecting to database...');
  
  const db = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 4000,
    ssl: { rejectUnauthorized: false }
  });

  console.log('✅ Connected to database\n');

  // ─── CREATE TABLES ──────────────────────────────────────

  // 1. Users table
  await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'hr', 'manager', 'employee') NOT NULL,
      name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table "users" created');

  // 2. Employees table
  await db.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id INT PRIMARY KEY AUTO_INCREMENT,
      user_id INT,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100),
      department VARCHAR(100),
      position VARCHAR(100),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);
  console.log('✅ Table "employees" created');

  // 3. Clearance requests table
  await db.query(`
    CREATE TABLE IF NOT EXISTS clearance_requests (
      id INT PRIMARY KEY AUTO_INCREMENT,
      request_no VARCHAR(20) UNIQUE NOT NULL,
      employee_id INT NOT NULL,
      type VARCHAR(50) NOT NULL,
      reason TEXT,
      urgency ENUM('normal', 'urgent', 'critical') DEFAULT 'normal',
      status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
      reviewed_by INT,
      review_note TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      FOREIGN KEY (reviewed_by) REFERENCES users(id)
    )
  `);
  console.log('✅ Table "clearance_requests" created');

  // 4. Feedback table
  await db.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT PRIMARY KEY AUTO_INCREMENT,
      submitted_by VARCHAR(100),
      role VARCHAR(50),
      category VARCHAR(50),
      rating INT,
      comment TEXT,
      suggestion TEXT,
      anonymous BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  console.log('✅ Table "feedback" created');

  // ─── INSERT DEFAULT USERS ───────────────────────────────

  console.log('\n🔄 Creating default users...');

  const adminPassword = await bcrypt.hash('REMOVED', 7);
  const hrPassword = await bcrypt.hash('REMOVED', 7);
  const managerPassword = await bcrypt.hash('REMOVED', 7);
  const employeePassword = await bcrypt.hash('REMOVED', 7);

  // Insert admin
  await db.query(`
    INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE password = VALUES(password)
  `, ['admin', adminPassword, 'admin', 'System Administrator']);
  console.log('✅ Admin user created');

  // Insert HR
  await db.query(`
    INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE password = VALUES(password)
  `, ['hr', hrPassword, 'hr', 'HR Manager']);
  console.log('✅ HR user created');

  // Insert Manager
  await db.query(`
    INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE password = VALUES(password)
  `, ['manager', managerPassword, 'manager', 'Department Manager']);
  console.log('✅ Manager user created');

  // Insert Employee
  await db.query(`
    INSERT INTO users (username, password, role, name) VALUES (?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE password = VALUES(password)
  `, ['employee', employeePassword, 'employee', 'John Employee']);
  console.log('✅ Employee user created');

  // ─── CREATE SAMPLE EMPLOYEE RECORDS ────────────────────

  console.log('\n🔄 Creating sample employee records...');

  // Get user IDs
  const [users] = await db.query('SELECT id, username FROM users WHERE username IN (?, ?, ?, ?)', 
    ['admin', 'hr', 'manager', 'employee']);

  const userIdMap = {};
  users.forEach(u => { userIdMap[u.username] = u.id; });

  // Insert employee records
  await db.query(`
    INSERT INTO employees (user_id, name, email, department, position) VALUES
    (?, 'System Admin', 'admin@example.com', 'IT', 'Administrator'),
    (?, 'HR Manager', 'hr@example.com', 'Human Resources', 'HR Manager'),
    (?, 'Department Manager', 'manager@example.com', 'Engineering', 'Manager'),
    (?, 'John Employee', 'john@example.com', 'Engineering', 'Developer')
    ON DUPLICATE KEY UPDATE name = VALUES(name)
  `, [userIdMap['admin'], userIdMap['hr'], userIdMap['manager'], userIdMap['employee']]);
  
  console.log('✅ Sample employees created');

  console.log('\n🎉🎉🎉 DATABASE MIGRATION COMPLETE! 🎉🎉🎉');
  console.log('\nDefault login credentials:');
  console.log('  admin:    REMOVED');
  console.log('  hr:       REMOVED');
  console.log('  manager:  REMOVED');
  console.log('  employee: REMOVED');
  
  await db.end();
  process.exit(0);
}

migrate().catch(err => {
  console.error('\n❌ Migration failed:', err);
  process.exit(1);
});
