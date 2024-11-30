import { RowDataPacket, ResultSetHeader } from "mysql2/promise";
import database from "../config/database";

interface Booking {
  id?: number;
  user_id: number;
  room_id: number;
  check_in_date: Date;
  check_out_date: Date;
}

const Booking = {
  createBooking: async (bookingData: Booking): Promise<Booking> => {
    // Check for overlapping bookings before inserting
    const overlapCheckQuery = `
      SELECT * FROM bookings
      WHERE room_id = ? 
      AND (check_in_date < ? AND check_out_date > ?)
      `;
    
    const [existingBookings] = await database.query(overlapCheckQuery, [
      bookingData.room_id,
      bookingData.check_out_date,
      bookingData.check_in_date,
    ]);

    if ((existingBookings as any[]).length > 0) {
      throw new Error("Room is already booked for the selected dates.");
    };

    const query = `
      INSERT INTO bookings (user_id, room_id, check_in_date, check_out_date)
      VALUES (?, ?, ?, ?)
    `;
    const [result] = await database.execute<ResultSetHeader>(query, [
      bookingData.user_id,
      bookingData.room_id,
      bookingData.check_in_date,
      bookingData.check_out_date,
    ]);
    return { id: result.insertId, ...bookingData };
  },

  getUserBookings: async (user_id: number): Promise<Booking[]> => {
    const query = `SELECT * FROM bookings WHERE user_id = ?`;
    const [rows] = await database.execute<RowDataPacket[]>(query, [user_id]);
    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      room_id: row.room_id,
      check_in_date: new Date(row.check_in_date),
      check_out_date: new Date(row.check_out_date),
    }));
  },

  getAllBookings: async (): Promise<Booking[]> => {
    const query = `SELECT * FROM bookings`;
    const [rows] = await database.execute<RowDataPacket[]>(query);
    return rows.map((row) => ({
      id: row.id,
      user_id: row.user_id,
      room_id: row.room_id,
      check_in_date: new Date(row.check_in_date),
      check_out_date: new Date(row.check_out_date),
    }));
  },

  updateBooking: async (
    bookingId: number,
    bookingData: Booking
  ): Promise<boolean> => {
    const query = `
      UPDATE bookings
      SET user_id = ?, room_id = ?, check_in_date = ?, check_out_date = ?
      WHERE id = ?
    `;
    const [result] = await database.execute<ResultSetHeader>(query, [
      bookingData.user_id,
      bookingData.room_id,
      bookingData.check_in_date.toISOString().slice(0, 10),
      bookingData.check_out_date.toISOString().slice(0, 10),
      bookingId,
    ]);
    return result.affectedRows > 0;
  },

  deleteBooking: async (bookingId: number): Promise<boolean> => {
    const query = `DELETE FROM bookings WHERE id = ?`;
    const [result] = await database.execute<ResultSetHeader>(query, [bookingId]);
    return result.affectedRows > 0;
  },
};

export default Booking;

