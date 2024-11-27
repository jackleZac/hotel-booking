// src/controllers/bookingController.ts
import { Request, Response } from "express";
import Booking from "../model/Booking";

export const createBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingData = req.body;
    const newBooking = await Booking.createBooking(bookingData);
    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getUserBookings = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Number(req.params.userId);
    const bookings = await Booking.getUserBookings(userId);
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllBookings = async (_req: Request, res: Response): Promise<void> => {
  try {
    const bookings = await Booking.getAllBookings();
    res.json(bookings);
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = Number(req.params.id);
    const bookingData = req.body;
    const success = await Booking.updateBooking(bookingId, bookingData);
    if (!success) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ message: "Booking updated successfully" });
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBooking = async (req: Request, res: Response): Promise<void> => {
  try {
    const bookingId = Number(req.params.id);
    const success = await Booking.deleteBooking(bookingId);
    if (!success) {
      res.status(404).json({ error: "Booking not found" });
      return;
    }
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
