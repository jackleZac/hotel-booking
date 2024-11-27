import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import database from "../config/database"; // Updated database configuration with pooling

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "e34c4e0bd8ac45fb83c3cf07c4e1f3f2e4f4c5e6f8e7e2d8c3e8d6c5f7e9e3b1"; // Use an environment variable for security
const SALT_ROUNDS = 10; // Number of bcrypt salt rounds

// Register a new user
export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role = "user" } = req.body; // Default role to "user"

  try {
    // Check if the user already exists
    const [existingUser] = await database.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if ((existingUser as any[]).length > 0) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert the new user into the database
    const [result]: any = await database.execute(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashedPassword, role]
    );

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertId,
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
    const [users] = await database.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

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
      { user_id: user.user_id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Return the token and user details
    res.json({
      message: "Login successful",
      token,
      user: {
        user_id: user.user_id,       // Include the user ID
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
