// config/db.ts
import mysql, { Connection } from "mysql2";

const database: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "hotel_booking",
});

database.connect((err) => {
  if (err) throw err;
  console.log("Connected to MySQL database.");
});

export default database;
