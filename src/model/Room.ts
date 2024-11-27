import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Import MySQL2 types
import database from "../config/database"; // Updated database import to use connection pooling

interface Room {
  room_id?: number;
  type: string;
  number: string;
  price: number;
  description: string;
  imageUrl?: string;
}

const Room = {
  // Get all rooms
  getAllRooms: async (): Promise<Room[]> => {
    try {
      const [results] = await database.execute<RowDataPacket[]>("SELECT * FROM rooms");

      // Return the results as Room objects
      return results.map(room => ({
        room_id: room.room_id,
        type: room.type,
        number: room.number,
        price: room.price,
        description: room.description,
        imageUrl: room.imageUrl
      }));
    } catch (err) {
      throw new Error("Error retrieving rooms: " + err);
    }
  },

  // Create a new room
  createRoom: async (roomData: Room): Promise<Room> => {
    try {
      const [results] = await database.execute<ResultSetHeader>(
        "INSERT INTO rooms (type, number, price, description, imageUrl) VALUES (?, ?, ?, ?, ?)",
        [roomData.type, roomData.number, roomData.price, roomData.description, roomData.imageUrl]
      );

      // Return the new room object with the generated ID
      return { room_id: results.insertId, ...roomData };
    } catch (err) {
      throw new Error("Error creating room: " + err);
    }
  },

  // Update room details
  updateRoom: async (roomId: number, roomData: Partial<Room>): Promise<void> => {
    try {
      await database.execute(
        "UPDATE rooms SET ? WHERE room_id = ?",
        [roomData, roomId]
      );
    } catch (err) {
      throw new Error("Error updating room: " + err);
    }
  },

  // Delete a room
  deleteRoom: async (roomId: number): Promise<void> => {
    try {
      await database.execute("DELETE FROM rooms WHERE room_id = ?", [roomId]);
    } catch (err) {
      throw new Error("Error deleting room: " + err);
    }
  },
};

export default Room;
