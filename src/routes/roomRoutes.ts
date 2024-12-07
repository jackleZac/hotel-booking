import { Router } from "express";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controller/roomController";
import { authenticateToken, checkAdmin } from "../middleware/authMiddleware";
import multer from "multer";
import path from "path";

const router = Router();

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route to fetch all rooms (public) (http://localhost:5000/api/rooms/)
router.get("/", authenticateToken, getAllRooms);

// Route to create a new room (admin-only) (http://localhost:5000/api/rooms/)
router.post(
  "/",
  authenticateToken,
  checkAdmin,
  upload.single("imageUrl"), // Ensure upload comes after authentication
  createRoom
);

// Route to update a specific room (admin-only) (http://localhost:5000/api/rooms/:id)
router.put(
  "/:id",
  authenticateToken,
  checkAdmin,
  upload.single("imageUrl"), // Ensure upload comes after authentication
  updateRoom
);

// Route to delete a specific room (admin-only) (http://localhost:5000/api/rooms/:id)
router.delete("/:id", authenticateToken, checkAdmin, deleteRoom);


export default router;

