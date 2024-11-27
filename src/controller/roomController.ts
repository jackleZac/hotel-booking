import { Request, Response } from "express";
import Room from "../model/Room"; // Updated import path

// Get all rooms
export const getAllRooms = async (req: Request, res: Response): Promise<void> => {
  try {
    const rooms = await Room.getAllRooms();
    res.json(rooms);
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
