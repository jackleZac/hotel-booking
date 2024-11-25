
// src/routes/authRoutes.ts
import { Router } from "express";
import { register, login } from "../controller/authController";

const router = Router();

// POST /api/auth/register - Register a new user
router.post("/register", register);

// POST /api/auth/login - Log in an existing user
router.post("/login", login);

export default router;
