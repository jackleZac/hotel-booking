import { Request, Response } from "express";
import { Pool } from "mysql2/promise"; // Using promise-based API for better async/await support
import database from "../config/database";

// User: Create a new booking
export const createBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const [results]: any = await database.execute(
      `SELECT * FROM bookings WHERE room_id = ? 
       AND check_out_date >= ? AND check_in_date <= ?`,
      [roomId, checkInDate, checkOutDate]
    );

    if (results.length > 0) {
      res
        .status(400)
        .json({ error: "Room is not available for the selected dates" });
      return;
    }

    const [result]: any = await database.execute(
      `INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date) VALUES (?, ?, ?, ?)`,
      [userId, roomId, checkInDate, checkOutDate]
    );

    res.status(201).json({
      message: "Booking created successfully",
      bookingId: result.insertId,
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// User: Get all bookings for the logged-in user
export const getUserBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  const userId = req.params.userId;

  try {
    const [results]: any = await database.execute(
      `SELECT * FROM bookings WHERE user_id = ?`,
      [userId]
    );

    res.json(results);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: Get all bookings
export const getAllBookings = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const [results]: any = await database.execute(`SELECT * FROM bookings`);
    res.json(results);
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: Update booking details
export const updateBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookingId = req.params.id;
  const { userId, roomId, checkInDate, checkOutDate } = req.body;

  try {
    const [result]: any = await database.execute(
      `UPDATE bookings 
       SET user_id = ?, room_id = ?, check_in_date = ?, check_out_date = ? 
       WHERE id = ?`,
      [userId, roomId, checkInDate, checkOutDate, bookingId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.status(200).json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Admin: Delete a booking
export const deleteBooking = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookingId = req.params.id;

  try {
    const [result]: any = await database.execute(
      `DELETE FROM bookings WHERE id = ?`,
      [bookingId]
    );

    if (result.affectedRows === 0) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }

    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
