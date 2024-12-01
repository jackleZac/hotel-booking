import { ResultSetHeader, RowDataPacket } from "mysql2";
import bcrypt from "bcrypt"; // Import bcrypt for hashing and comparing passwords
import database from "../config/database";

const SALT_ROUNDS = 10;

interface User {
  user_id?: number;
  username: string;
  password: string;
  role: string;
  email: string;
  phone_number: string;
}

const User = {
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
  },

  async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  },

  async findByUsername(username: string): Promise<User | null> {
    const [results] = await database.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE username = ?", [username]
    );
    return results.length > 0 ? (results[0] as User) : null;
  },

  // New Method: Retrieve user by user_id
  async findById(user_id: number): Promise<User | null> {
    console.log("Querying database for user_id:", user_id);
    const [results] = await database.execute<RowDataPacket[]>(
      "SELECT * FROM users WHERE user_id = ?", [user_id]
    );
    return results.length > 0 ? (results[0] as User) : null;
  },

  async createUser(user: User): Promise<User> {
    const hashedPassword = await this.hashPassword(user.password);
    const query = `
      INSERT INTO users (username, password, role, email, phone_number)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [results] = await database.execute<ResultSetHeader>(query, [
      user.username,
      hashedPassword,
      user.role,
      user.email,
      user.phone_number
    ]);
    return { user_id: results.insertId, ...user, password: hashedPassword };
  },

  async updateUserProfile(user_id: number, updatedData: Partial<User>): Promise<boolean> {
    // Determine if the password needs to be updated
    const newPassword = updatedData.password
      ? await this.hashPassword(updatedData.password) // Hash the new password if provided
      : null;
  
    const query = `
      UPDATE users
      SET 
        username = COALESCE(?, username),
        password = COALESCE(?, password),
        email = COALESCE(?, email),
        phone_number = COALESCE(?, phone_number)
      WHERE user_id = ?
    `;
  
    const [result] = await database.execute<ResultSetHeader>(query, [
      updatedData.username ?? null,
      newPassword ?? null, // Update password only if it's provided
      updatedData.email ?? null,
      updatedData.phone_number ?? null,
      user_id
    ]);
  
    return result.affectedRows > 0;
  }
  
}  

export default User;


