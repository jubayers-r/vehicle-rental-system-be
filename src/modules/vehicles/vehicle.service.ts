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

const deleteById = async (vid: string) => {
  return await pool.query(
    `
        DELETE FROM vehicles WHERE id = $1
        `,
    [vid],
  );
};

const updateById = async (vid: string, payload: Record<string, unknown>) => {
  const keys = Object.keys(payload);

  const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  const values = keys.map((key: any) => payload[key]);

  const result = await pool.query(
    `
    UPDATE vehicles
    SET ${setString}
    WHERE id = $${keys.length + 1}
    RETURNING *
    `,
    [...values, vid],
  );

  return result.rows[0];
};

//

const vehicleQuery = async (vid: string) =>
  await pool.query(
    `
    SELECT vehicle_name, daily_rent_price, availability_status FROM vehicles WHERE id = $1
    `,
    [vid],
  );

const updateCarStatus = async (vehicle_id: string, status: string) =>
  await pool.query(
    `
    UPDATE vehicles
    SET availability_status = $1
    WHERE id = $2
    RETURNING *
    `,
    [status, vehicle_id],
  );

export const vehicleServices = {
  createVehicle,
  getAllVehicles,
  getById,
  deleteById,
  vehicleQuery,
  updateCarStatus,
  updateById,
};
