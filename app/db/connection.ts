import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const personPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.PERSON_DB_USER || "root",
  password: process.env.PERSON_DB_PASSWORD,
  database: process.env.PERSON_DB_NAME || "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const salesPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.SALES_DB_USER || "root",
  password: process.env.SALES_DB_PASSWORD,
  database: process.env.SALES_DB_NAME || "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const compPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.COMP_DB_USER || "root",
  password: process.env.COMP_DB_PASSWORD,
  database: process.env.COMP_DB_NAME || "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const toolsPool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.TOOLS_DB_USER || "root",
  password: process.env.TOOLS_DB_PASSWORD,
  database: process.env.TOOLS_DB_NAME || "test_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});
