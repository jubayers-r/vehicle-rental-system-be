import { pool } from "../../config/db";

const createUser = async (userData: Record<string, string>) => {
  const { name, email, password, phone, role } = userData;
  return await pool.query(
    `
    INSERT INTO users(name, email, password, phone, role) VALUES($1, $2, $3, $4, $5) RETURNING *
    `,
    [name, email, password, phone, role],
  );
};

export const authServices = {
  createUser,
};
