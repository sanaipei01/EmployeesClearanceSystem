Employee Clearance System (ECS)

A full-stack web application for managing employee clearance requests with role-based access control. Built with React, Node.js, Express, and MySQL.

What it does

Employees can submit clearance requests, managers and HR can approve or reject them, and everyone receives email notifications. There are 4 dashboards — Admin, HR, Manager, and Employee — each showing recent activity with expandable sections.

Tech Stack

Frontend — React 18, React Router, CSS3

Backend — Node.js, Express.js

Database — MySQL

Auth — JWT, Bcrypt

Email — Nodemailer (Gmail)

Features

Role-based login (Admin, HR, Manager, Employee)

Submit and track clearance requests

Approve / reject workflow with email notifications

Downloadable clearance certificates

AI chatbot assistant

Resignation form (4 steps)

Feedback and star ratings

Mobile responsive

Dark and light mode support

Getting Started
1. Clone the repo
git clone https://github.com/sanaipei01/EmployeesClearanceSystem.git
cd EmployeesClearanceSystem
2. Set up the database
mysql -u root -p < database/setup.sql
3. Set up environment variables

Copy .env.example to .env in the backend/ folder and fill in your secrets:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=<your_mysql_password>
DB_NAME=ecs_db
JWT_SECRET=<your_jwt_secret_key>
PORT=5000
EMAIL_USER=<your_email>
EMAIL_PASS=<your_email_app_password>
HR_EMAIL=<hr_email>

.env is not tracked in Git. Do not commit your real secrets.

4. Run the backend
cd backend
npm install
npm run dev
5. Run the frontend
cd frontend
npm install
npm start
Login Credentials
Role	Username	Password
Admin	admin	<contact developer>
HR	hr	<contact developer>
Manager	manager	<contact developer>
Employee	employee	<contact developer>

To get login credentials contact: sanaipeitenkes@gmail.com

Developer

Sanaipei Tenkes
BSc Software Engineering — USIU Africa (2023–2027)
📧 sanaipeitenkes@gmail.com

🐙 github.com/sanaipei01

📍 Nairobi, Kenya