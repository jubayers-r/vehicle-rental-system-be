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
      details: error,
    });
  }
  return result;
};

const deleteOne = async (req: Request, res: Response) => {
  const result = await userServices.deleteById(req.params.userId!);

  try {
    if (!result.rowCount) {
      res.status(404).json({
        success: false,
        message: "user not found",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      details: error,
    });
  }
};

export const userControllers = {
  findAll,
  deleteOne,
};
