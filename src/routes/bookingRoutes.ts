import { Router } from "express";
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  deleteBooking,
} from "../controller/bookingController";
import { authenticateToken, checkAdmin } from "../middleware/authMiddleware";

const router = Router();

// Route to create a new booking (authenticated users only)
router.post("/", authenticateToken, createBooking);

// Route to get bookings for a specific user (authenticated users only)
router.get("/:userId", authenticateToken, getUserBookings);

// Route to get all bookings (admin-only) (http://localhost:5000/bookings/)
router.get("/", authenticateToken, checkAdmin, getAllBookings);

// Route to update a booking (admin-only)
router.put("/:id", authenticateToken, checkAdmin, updateBooking);

// Route to delete a booking (admin-only)
router.delete("/:id", authenticateToken, checkAdmin, deleteBooking);

export default router;


