import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "studybuddy",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Convert pool.promise() to use promises
const promisePool = pool.promise();

export default promisePool;
