import { pool } from "../../config/db";

const createVehicle = async (payload: Record<string, unknown>) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  return await pool.query(
    `
    INSERT INTO vehicles(vehicle_name, type, registration_number, daily_rent_price, availability_status) VALUES($1, $2, $3, $4, $5) RETURNING *
        `,
    [
      vehicle_name,
      type,
      registration_number,
      daily_rent_price,
      availability_status,
    ],
  );
};

const getAllVehicles = async () =>
  await pool.query(`
        SELECT * FROM vehicles
        `);

const getById = async (vid: string) =>
  await pool.query(
    `
        SELECT * FROM vehicles WHERE id = $1
        `,
    [vid],
  );

export const vehicleServices = { createVehicle, getAllVehicles, getById };
