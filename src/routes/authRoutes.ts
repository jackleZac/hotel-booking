
// src/routes/authRoutes.ts
import { Router } from "express";
import { register, login, updateProfile, getUserDetails } from "../controller/authController";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Log in an existing user
router.post("/login", login);

// PUT /api/auth/update-profile - Update an existing user's profile
router.put("/update-profile", updateProfile);  

// GET /api/auth/user/:user_id - Fetch user details by user_id
router.get("/:user_id", getUserDetails);

export default router;
