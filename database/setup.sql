-- ============================================
-- EMPLOYEE CLEARANCE SYSTEM - DATABASE SETUP
-- Run this in MySQL Workbench or phpMyAdmin
-- ============================================

CREATE DATABASE IF NOT EXISTS employee_clearance;
USE employee_clearance;

-- USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  username    VARCHAR(50)  NOT NULL UNIQUE,
  password    VARCHAR(255) NOT NULL,
  role        ENUM('admin','hr','manager','employee') NOT NULL DEFAULT 'employee',
  department  VARCHAR(100),
  email       VARCHAR(100),
  manager_id  INT NULL,
  status      ENUM('active','inactive') DEFAULT 'active',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL
);

-- CLEARANCE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS clearance_requests (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  employee_id    INT NOT NULL,
  type           VARCHAR(100) NOT NULL,
  reason         TEXT,
  urgency        ENUM('normal','urgent','critical') DEFAULT 'normal',
  status         ENUM('pending','processing','approved','rejected') DEFAULT 'pending',
  reviewer_note  TEXT,
  reviewed_by    INT NULL,
  reviewed_at    TIMESTAMP NULL,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- SEED DATA - Default Users
-- Passwords are bcrypt hashed:
--   admin123, hr123, manager123, emp123
-- ============================================

INSERT INTO users (name, username, password, role, department, email) VALUES
('System Admin',      'admin',    '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin',    'Administration', 'admin@ecs.com'),
('HR Officer',        'hr',       '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'hr',       'Human Resources', 'hr@ecs.com'),
('Dept Manager',      'manager',  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'manager',  'IT Department',  'manager@ecs.com'),
('John Employee',     'employee', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'employee', 'IT Department',  'john@ecs.com');

-- NOTE: The hashed passwords above use 'password' as the value.
-- After running this, use the demo login in the app, OR
-- update passwords by running the backend seed script below.

-- SAMPLE REQUESTS
INSERT INTO clearance_requests (employee_id, type, reason, urgency, status) VALUES
(4, 'Resignation Clearance', 'Leaving the company',      'normal',   'pending'),
(4, 'Travel Clearance',      'Business trip to Nairobi', 'urgent',   'approved'),
(4, 'Leave Clearance',       'Annual leave request',     'normal',   'processing');