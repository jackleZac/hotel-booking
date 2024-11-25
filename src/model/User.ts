// src/models/User.ts
import { ResultSetHeader, RowDataPacket } from "mysql2"; // Import ResultSetHeader for typing
import database from "../config/database";

interface User {
  user_id?: number;
  username: string;
  password: string; // Hashed password
}

const User = {
  // Find user by username
  findByUsername: (username: string): Promise<User | null> => {
    return new Promise((resolve, reject) => {
      database.query(
        "SELECT * FROM users WHERE username = ?",
        [username],
        (err, results) => {
          if (err) return reject(err);

          // Type cast results to an array of RowDataPacket, which is often used by MySQL2 for query results
          const users = results as RowDataPacket[];

          // Cast the first row (users[0]) to User type
          const user = users[0] as User;

          // Return the first user or null if not found
          resolve(user || null);
        }
      );
    });
  },

  // Create new user
  createUser: (user: User): Promise<User> => {
    return new Promise((resolve, reject) => {
      database.query("INSERT INTO users SET ?", user, (err, results) => {
        if (err) reject(err);

        // Explicitly cast results to ResultSetHeader
        const resultHeader = results as ResultSetHeader;

        // Return user object with generated ID
        resolve({ user_id: resultHeader.insertId, ...user });
      });
    });
  },
};

export default User;
