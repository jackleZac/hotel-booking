// src/models/Booking.ts
import { RowDataPacket, ResultSetHeader } from "mysql2"; // Import MySQL2 types
import database from "../config/database";

interface Booking {
  id?: number;
  userId: number;
  roomId: number;
  checkInDate: Date;
  checkOutDate: Date;
}

const Booking = {
  // Create a new booking
  createBooking: (bookingData: Booking): Promise<Booking> => {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date)
        VALUES (?, ?, ?, ?)
      `;
      database.query(
        query,
        [
          bookingData.userId,
          bookingData.roomId,
          bookingData.checkInDate.toISOString().slice(0, 10), // Format as YYYY-MM-DD
          bookingData.checkOutDate.toISOString().slice(0, 10),
        ],
        (err, results) => {
          if (err) return reject(err);

          // Cast the results to ResultSetHeader to access insertId
          const resultHeader = results as ResultSetHeader;

          // Return the new booking object with the generated ID
          resolve({ id: resultHeader.insertId, ...bookingData });
        }
      );
    });
  },

  // Get bookings for a specific user
  getUserBookings: (userId: number): Promise<Booking[]> => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM bookings WHERE user_id = ?`;
      database.query(query, [userId], (err, results) => {
        if (err) return reject(err);

        // Cast results to RowDataPacket[] to access row data
        const bookings = results as RowDataPacket[];

        // Return the results as Booking objects
        resolve(
          bookings.map((booking) => ({
            id: booking.id,
            userId: booking.user_id,
            roomId: booking.room_id,
            checkInDate: new Date(booking.check_in_date),
            checkOutDate: new Date(booking.check_out_date),
          }))
        );
      });
    });
  },

  // Check room availability between two dates
  checkAvailability: (
    roomId: number,
    checkInDate: string,
    checkOutDate: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM bookings
        WHERE room_id = ?
        AND check_out_date >= ?
        AND check_in_date <= ?
      `;
      database.query(
        query,
        [roomId, checkInDate, checkOutDate],
        (err, results) => {
          if (err) return reject(err);

          // Cast results to RowDataPacket[] to access row data and the length property
          const bookings = results as RowDataPacket[];

          // Room is available if no conflicting bookings
          resolve(bookings.length === 0);
        }
      );
    });
  },

  // Update booking details
  updateBooking: (
    bookingId: number,
    bookingData: Booking
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE bookings
        SET user_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?
        WHERE id = ?
      `;
      database.query(
        query,
        [
          bookingData.userId,
          bookingData.roomId,
          bookingData.checkInDate.toISOString().slice(0, 10), // Format as YYYY-MM-DD
          bookingData.checkOutDate.toISOString().slice(0, 10),
          bookingId,
        ],
        (err, result) => {
          if (err) return reject(err);

          // Resolve to true if rows were affected
          resolve((result as ResultSetHeader).affectedRows > 0);
        }
      );
    });
  },

  // Delete a booking
  deleteBooking: (bookingId: number): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM bookings WHERE id = ?`;
      database.query(query, [bookingId], (err, result) => {
        if (err) return reject(err);

        // Resolve to true if rows were deleted
        resolve((result as ResultSetHeader).affectedRows > 0);
      });
    });
  },

  // Get all bookings
  getAllBookings: (): Promise<Booking[]> => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM bookings`;
      database.query(query, (err, results) => {
        if (err) return reject(err);

        // Cast results to RowDataPacket[] to access row data
        const bookings = results as RowDataPacket[];

        // Return the results as Booking objects
        resolve(
          bookings.map((booking) => ({
            id: booking.id,
            userId: booking.user_id,
            roomId: booking.room_id,
            checkInDate: new Date(booking.check_in_date),
            checkOutDate: new Date(booking.check_out_date),
          }))
        );
      });
    });
  },
};

export default Booking;