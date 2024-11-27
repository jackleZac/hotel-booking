import { ResultSetHeader, RowDataPacket } from "mysql2"; // Import ResultSetHeader for typing
import database from "../config/database"; // Updated database configuration with pooling

interface User {
  user_id?: number;
  username: string;
  password: string; // Hashed password
}

const User = {
  // Find user by username
  findByUsername: async (username: string): Promise<User | null> => {
    try {
      const [results] = await database.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE username = ?",
        [username]
      );

      // Return the first user or null if not found
      return results.length > 0 ? (results[0] as User) : null;
    } catch (err) {
      throw new Error("Error finding user by username: " + err);
    }
  },

  // Create new user
  createUser: async (user: User): Promise<User> => {
    try {
      const [results] = await database.execute<ResultSetHeader>(
        "INSERT INTO users (username, password) VALUES (?, ?)",
        [user.username, user.password]
      );

      // Return user object with generated ID
      return { user_id: results.insertId, ...user };
    } catch (err) {
      throw new Error("Error creating new user: " + err);
    }
  },
};

export default User;
