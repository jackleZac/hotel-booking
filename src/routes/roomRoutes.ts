import { Router } from "express";
import {
  getAllRooms,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controller/roomController";
import { authenticateToken, checkAdmin } from "../middleware/authMiddleware";

const router = Router();

// Route to fetch all rooms (public) (http://localhost:5000/api/rooms/)
router.get("/", authenticateToken, getAllRooms);

// Route to create a new room (admin-only) (http://localhost:5000/api/rooms/)
router.post("/", authenticateToken, checkAdmin, createRoom);

// Route to update a specific room (admin-only) (http://localhost:5000/api/rooms/:id)
router.put("/:id", authenticateToken, checkAdmin, updateRoom);

// Route to delete a specific room (admin-only) (http://localhost:5000/api/rooms/:id)
router.delete("/:id", authenticateToken, checkAdmin, deleteRoom);

export default router;
