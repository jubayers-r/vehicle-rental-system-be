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

const updateById = async (userId: string, payload: string, key: any) => {
  await pool.query(
    `
    UPDATE users
    SET ${key} = $1
    WHERE id = $2
    RETURNING *
    `,
    [payload[key], userId],
  );
};

const getById = async (userId: string) => {
  return await pool.query(
    `
         SELECT * FROM users WHERE id=$1
        `,
    [userId],
  );
};

export const userServices = { getAllUsers, deleteById, updateById, getById };
