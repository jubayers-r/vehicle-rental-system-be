import { Request, Response } from "express";
import { userServices } from "./user.service";

const findAll = async (_req: Request, res: Response) => {
  const result = await userServices.getAllUsers();

  try {
    if (!result.rows.length) {
      res.status(404).json({
        success: false,
        message: "No users found on users table",
      });
    } else {
      result.rows.forEach((row) => {
        delete row.password;
      });
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  return result;
};

export const userControllers = {
  findAll,
};
