import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../model/User";

const JWT_SECRET = process.env.JWT_SECRET || "e34c4e0bd8ac45fb83c3cf07c4e1f3f2e4f4c5e6f8e7e2d8c3e8d6c5f7e9e3b1";

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, password, role = "user", email, phone_number } = req.body;

  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }
    const newUser = await User.createUser({ username, password, role, email, phone_number });
    res.status(201).json({ message: "User registered successfully", userId: newUser.user_id });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);
    if (!user) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    const isPasswordValid = await User.verifyPassword(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ error: "Invalid username or password" });
      return;
    }

    const token = jwt.sign(
      { user_id: user.user_id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { user_id, username, password, email, phone_number } = req.body;

  try {
    // Check if the user exists before updating
    const user = await User.findById(user_id);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    // Update the user profile, password will only be updated if provided
    const success = await User.updateUserProfile(user_id, { username, password, email, phone_number });

    if (!success) {
      res.status(400).json({ message: "Failed to update profile" });
      return;
    }

    // If the password was updated, we check it here
    if (password) {
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        res.status(400).json({ message: "Invalid password after update" });
        return;
      }
    }

    // Generate a new JWT token with updated user details
    const token = jwt.sign(
      { user_id, username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send response with updated message, user data, and new token
    res.status(200).json({ message: "Profile updated successfully", user: { ...user, username, email, phone_number }, token });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserDetails = async (req: Request, res: Response): Promise<void> => {
  console.log("Received user_id:", req.params.user_id);
  const { user_id } = req.params;

  try {
    const user = await User.findById(Number(user_id));
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json({ message: "User details fetched successfully", user });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
