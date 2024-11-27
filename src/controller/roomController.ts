import { Request, Response } from "express";
import Room from "../model/Room"; // Updated import path

interface AuthenticatedRequest extends Request {
  user?: { role: string }; // Match the structure of your JWT payload
}

// Get all rooms
export const getAllRooms = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    if (req.user?.role === "admin") {
      // Admin: Fetch all rooms
      const rooms = await Room.getAllRooms();
      res.json(rooms);
    } else {
      // User: Fetch only available rooms
      const { check_in_date, check_out_date } = req.query;
      console.log("Check-in Date:", check_in_date);
      console.log("Check-out Date:", check_out_date);

      const availableRooms = await Room.getAvailableRooms(check_in_date as string, check_out_date as string);
      res.json(availableRooms);
    }
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new room
export const createRoom = async (req: Request, res: Response): Promise<void> => {
  const { type, number, price, description, imageUrl } = req.body;

  try {
    const newRoom = await Room.createRoom({
      type,
      number,
      price,
      description,
      imageUrl,
    });
    res
      .status(201)
      .json({ message: "Room created successfully", room: newRoom });
  } catch (error) {
    console.error("Error creating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a room
export const updateRoom = async (req: Request, res: Response): Promise<void> => {
  const roomId = parseInt(req.params.id, 10);
  const updates = req.body;

  try {
    await Room.updateRoom(roomId, updates);
    res.status(200).json({ message: "Room updated successfully" });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a room
export const deleteRoom = async (req: Request, res: Response): Promise<void> => {
  const roomId = parseInt(req.params.id, 10);

  try {
    await Room.deleteRoom(roomId);
    res.status(200).json({ message: "Room deleted successfully" });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
