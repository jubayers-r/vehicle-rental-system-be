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

const updateById = async (userId: string, payload: string) => {
  const keys = Object.keys(payload);

  // extra safety layer eventhough I this codebase dont need it, as hopefully nones gonna touch my code but just to remember gpt's quote I loved today, "Use it to keep your service fool proof (incase someone deletes contoller's safety layers by mistake)"

  if (!keys.length) {
    throw new Error("No valid fields to update");
  }

  const setString = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");

  const values = keys.map((key: any) => payload[key]);

  const result = await pool.query(
    `
    UPDATE users
    SET ${setString}
    WHERE id = $${keys.length + 1}
    RETURNING *;
    `,
    [...values, userId],
  );
  return result.rows[0];
};



export const userServices = { getAllUsers, deleteById, updateById };
