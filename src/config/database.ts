import mysql, { Pool } from "mysql2/promise";

const database: Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_booking",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default database;
