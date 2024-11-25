import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "e34c4e0bd8ac45fb83c3cf07c4e1f3f2e4f4c5e6f8e7e2d8c3e8d6c5f7e9e3b1" // Use environment variables for production

// Extend the Express Request type to include `user` property
interface AuthenticatedRequest extends Request {
  user?: JwtPayload | string; // Adjust based on the structure of your JWT payload
}

// Middleware to authenticate the token
export const authenticateToken = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Expecting "Bearer <token>"

  if (!token) {
    res.status(401).json({ error: "Access denied. Token missing!" });
    return;
  }

  // Verify token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(403).json({ error: "Invalid or expired token" });
      return;
    }

    // Attach decoded token payload to the request object
    req.user = decoded;
    next();
  });
};

// Middleware to check admin privileges
export const checkAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  // Ensure the user is authenticated first
  if (!req.user) {
    res.status(401).json({ error: "Access denied. Not authenticated!" });
    return;
  }

  // Check if the `user` property contains the admin role
  if (typeof req.user === "object" && req.user.role !== "admin") {
    res.status(403).json({ error: "Access denied. Admins only!" });
    return;
  }

  next();
};
