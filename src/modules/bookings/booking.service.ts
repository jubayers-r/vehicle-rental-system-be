import { pool } from "../../config/db";

const createBooking = async (payload: Record<string, unknown>) => {
  const {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
  } = payload;

  return await pool.query(
    `
    INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [
      customer_id,
      vehicle_id,
      rent_start_date,
      rent_end_date,
      total_price,
      "active",
    ],
  );
};

const getAllBookings = async () =>
  await pool.query(`
        SELECT * FROM bookings
        `);

const getById = async (uid: string) =>
  await pool.query(
    `
    SELECT * FROM bookings WHERE customer_id = $1
    `,
    [uid],
  );

//

const cancelBooking = async (status: string, bid: string) =>
  await pool.query(
    `
        UPDATE bookings
        SET status = $1
        WHERE id = $2 AND status = 'active'
        RETURNING *
        `,
    [status, bid],
  );

const bookingsQuery = async (bid: string) =>
  await pool.query(
    `
      SELECT vehicle_id, rent_start_date, rent_end_date
      FROM bookings
      WHERE id = $1
      `,
    [bid],
  );

export const bookingService = {
  createBooking,
  getAllBookings,
  getById,
  cancelBooking,
  bookingsQuery,
};
