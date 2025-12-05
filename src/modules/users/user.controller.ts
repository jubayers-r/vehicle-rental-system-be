import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";

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

const updateOne = async (req: Request, res: Response) => {
  const uid = req.params.userId;

  try {
    if (!Object.keys(req.body).length) {
      res.status(400).json({
        success: false,
        message: "Provide valid input",
      });
    } else {
      for (const key in req.body) {
        await userServices.updateById(uid!, req.body, key);
      }
      const result = await userServices.getById(uid!);

      delete result.rows[0].password;

      res.status(200).json({
        success: true,
        message: "User updated successfully",
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
};

export const userControllers = {
  findAll,
  deleteOne,
  updateOne,
};
