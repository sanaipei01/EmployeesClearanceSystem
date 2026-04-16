const mysql = require('mysql2');
require('dotenv').config();

const conn = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: true
  }
});

conn.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected to TiDB successfully!');
    conn.query('SHOW TABLES', (err, results) => {
      if (err) console.error('Query error:', err);
      else console.log('Tables:', results);
      conn.end();
    });
  }
});
