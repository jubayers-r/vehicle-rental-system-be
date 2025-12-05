
import { Request, Response } from "express";
import { userServices } from "./user.service";
import bcrypt from "bcryptjs";

const findAll = async (_req: Request, res: Response) => {
  const result = await userServices.getAllUsers();

  try {
    if (!result.rows.length) {
      res.status(404).json({
        success: false,
        message: "No users found on users table",
      });
    } else {
      res.status(200).json({
        success: true,
        message: "Users found successfully",
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

const create = async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const userData = {
    ...rest,
    password: hashedPass,
  };

  const result = await userServices.createUser(userData);

  try {
    if (!result.rows.length) {
      res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    } else {
      res.status(201).json({
        success: true,
        message: "User creatd successfully",
        data: result.rows,
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const userControllers = {
  findAll,
  create,
};
