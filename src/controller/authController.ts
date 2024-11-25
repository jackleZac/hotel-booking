import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "../config/database"; // Import the database connection

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "e34c4e0bd8ac45fb83c3cf07c4e1f3f2e4f4c5e6f8e7e2d8c3e8d6c5f7e9e3b1"; // Use an environment variable for security
const SALT_ROUNDS = 10; // Number of bcrypt salt rounds

// Helper function to execute SQL queries
const query = (sql: string, values: any = []) =>
  new Promise((resolve, reject) => {
    database.query(sql, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role = "user" } = req.body; // Default role to "user"

  try {
    // Check if the user already exists
    const existingUser = await query("SELECT * FROM users WHERE username = ?", [username]);
    if ((existingUser as any[]).length > 0) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user into the database with the role
    const result = await query(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: (result as any).insertId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Login an existing user
export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    // Find the user in the database
    const users = await query("SELECT * FROM users WHERE username = ?", [username]);
    if ((users as any[]).length === 0) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    const user = (users as any[])[0];

    // Check the password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    // Generate a JWT token with the user's role
    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role }, // Include the role
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
