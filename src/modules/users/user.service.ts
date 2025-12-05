import { pool } from "../../config/db";

const getAllUsers = async () =>
  await pool.query(`
    SELECT * FROM users
    `);

const deleteById = async (userId: string) => {
  return await pool.query(
    `
        DELETE FROM users WHERE id=$1
        `,
    [userId],
  );
};

export const userServices = { getAllUsers, deleteById };
