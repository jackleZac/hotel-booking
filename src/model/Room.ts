// src/models/Room.ts
import { RowDataPacket, ResultSetHeader } from 'mysql2'; // Import for MySQL2 types
import database from "../config/database";

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
  getAllRooms: (): Promise<Room[]> => {
    return new Promise((resolve, reject) => {
      database.query("SELECT * FROM rooms", (err, results) => {
        if (err) return reject(err);

        // Cast results to RowDataPacket[] to access row data
        const rooms = results as RowDataPacket[];

        // Return the results as Room objects
        resolve(rooms.map(room => ({
          room_id: room.room_id,
          type: room.type,
          number: room.number,
          price: room.price,
          description: room.description,
          imageUrl: room.imageUrl
        })));
      });
    });
  },

  // Create a new room
  createRoom: (roomData: Room): Promise<Room> => {
    return new Promise((resolve, reject) => {
      database.query("INSERT INTO rooms SET ?", roomData, (err, results) => {
        if (err) return reject(err);

        // Cast results to ResultSetHeader to access insertId
        const resultHeader = results as ResultSetHeader;

        // Return the new room object with the generated ID
        resolve({ room_id: resultHeader.insertId, ...roomData });
      });
    });
  },

  // Update room details
  updateRoom: (roomId: number, roomData: Partial<Room>): Promise<void> => {
    return new Promise((resolve, reject) => {
      database.query(
        "UPDATE rooms SET ? WHERE room_id = ?",
        [roomData, roomId],
        (err) => {
          if (err) return reject(err);
          resolve();
        }
      );
    });
  },

  // Delete a room
  deleteRoom: (roomId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
      database.query("DELETE FROM rooms WHERE room_id = ?", [roomId], (err) => {
        if (err) return reject(err);
        resolve();
      });
    });
  },
};

export default Room;

