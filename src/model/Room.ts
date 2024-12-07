import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Import MySQL2 types
import database from "../config/database"; // Updated database import to use connection pooling

interface Room {
  room_id?: number;
  type: string;
  number: string;
  price: number;
  description: string;
  imageUrl?: string | null;
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

  // Get a specific room by ID
  getRoomById: async (roomId: number): Promise<Room | null> => {
    try {
      const [results] = await database.execute<RowDataPacket[]>(
        "SELECT * FROM rooms WHERE room_id = ?",
        [roomId]
      );
      
      if (results.length > 0) {
        const room = results[0];
        return {
          room_id: room.room_id,
          type: room.type,
          number: room.number,
          price: room.price,
          description: room.description,
          imageUrl: room.imageUrl,
        };
      }

      return null; // If no room found
    } catch (err) {
      throw new Error("Error retrieving room by ID: " + err);
    }
  },

  // Get only available rooms (not currently booked)
  getAvailableRooms: async (check_in_date: string, check_out_date: string): Promise<Room[]> => {
    try {
      const [results] = await database.execute<RowDataPacket[]>(`
        SELECT r.*
        FROM rooms r
        LEFT JOIN bookings b
        ON r.room_id = b.room_id
           AND (b.check_in_date < ? AND b.check_out_date > ?)
        WHERE b.room_id IS NULL;
      `, [check_out_date, check_in_date]); // Ensures no overlapping bookings

      // Return the available rooms as objects
      return results.map((room) => ({
        room_id: room.room_id,
        type: room.type,
        number: room.number,
        price: room.price,
        description: room.description,
        imageUrl: room.imageUrl,
      }));
    } catch (err) {
      const errorMessage = (err as Error).message;
      throw new Error("Error retrieving available rooms: " + errorMessage);
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
  updateRoom: async (roomId: number, roomData: Partial<Room>): Promise<Room | null> => {
    try {
      // Ensure roomData is not empty
      if (Object.keys(roomData).length === 0) {
        throw new Error("No data to update.");
      }

      // Dynamically generate the SET clause based on roomData
      const setClause = Object.keys(roomData)
        .map((key) => `${key} = ?`)
        .join(", ");

      if (!setClause) {
        throw new Error("Invalid room data for update.");
      }

      // Prepare values for the query
      const values = [...Object.values(roomData), roomId];

      // Construct the SQL query
      const query = `UPDATE rooms SET ${setClause} WHERE room_id = ?`;

      // Execute the query
      await database.execute(query, values);

      // After updating, fetch and return the updated room by ID
      const updatedRoom = await Room.getRoomById(roomId);

      if (!updatedRoom) {
        throw new Error("Room not found after update.");
      }

      return updatedRoom; // Return the updated room

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

