import { pool } from "../../config/db";

const getAllUsers = async () =>
  await pool.query(`
    SELECT * FROM users
    `);


export const userServices = { getAllUsers };
