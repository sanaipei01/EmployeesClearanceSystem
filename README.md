# Employee Clearance System (ECS)

A full-stack web application for managing employee clearance requests with role-based access control. Built with React, Node.js, Express, and MySQL.

## What it does

Employees submit clearance requests, managers and HR approve or reject them, and everyone receives email notifications. There are 4 dashboards (Admin, HR, Manager, Employee), each showing recent activity with expandable sections.

## Tech Stack

- Frontend: React 18, React Router, CSS3
- Backend: Node.js, Express.js
- Database: MySQL
- Auth: JWT, Bcrypt
- Email: Nodemailer (Gmail)

## Features

- Role-based login (Admin, HR, Manager, Employee)
- Submit and track clearance requests
- Approve / reject workflow with email notifications
- Downloadable clearance certificates
- AI chatbot assistant
- Resignation form (4 steps)
- Feedback and star ratings
- Mobile responsive
- Dark and light mode support

## Getting Started

1. Clone the repo

       git clone https://github.com/sanaipei01/EmployeesClearanceSystem.git
       cd EmployeesClearanceSystem

2. Set up the database

       mysql -u root -p < database/setup.sql

3. Set up environment variables. Copy `backend/.env.example` to `backend/.env` and fill in your own values:

       DB_HOST=localhost
       DB_USER=<your_mysql_user>
       DB_PASSWORD=<your_mysql_password>
       DB_NAME=ecs_db
       JWT_SECRET=<any_long_random_string>
       PORT=5000
       EMAIL_USER=<your_email>
       EMAIL_PASS=<your_email_app_password>
       HR_EMAIL=<hr_email>
       SEED_ADMIN_PASSWORD=<choose_a_demo_password>
       SEED_HR_PASSWORD=<choose_a_demo_password>
       SEED_MANAGER_PASSWORD=<choose_a_demo_password>
       SEED_EMPLOYEE_PASSWORD=<choose_a_demo_password>

   `.env` is not tracked in Git. Never commit real secrets.

4. Create tables and seed the default users

       cd backend
       npm install
       node migrate.js

5. Run the backend

       npm run dev

6. Run the frontend (in a second terminal)

       cd frontend
       npm install
       npm start

## Logging in

Seeded usernames: `admin`, `hr`, `manager`, `employee`. Each password is whatever you set in the matching `SEED_*_PASSWORD` variable. There are no shared default credentials. For a hosted demo login, contact sanaipeitenkes@gmail.com.

## Screenshots

Coming soon (docs/screenshots/).

## Developer

Sanaipei Tenkes, BSc Software Engineering, USIU Africa (2023-2027)
GitHub: github.com/sanaipei01 | Nairobi, Kenya | sanaipeitenkes@gmail.com
