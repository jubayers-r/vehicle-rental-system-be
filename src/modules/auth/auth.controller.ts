import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { authServices } from "./auth.service";

const create = async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const userData = {
    ...rest,
    password: hashedPass,
  };

  const result = await authServices.createUser(userData);

  try {
    if (!result.rows.length) {
      res.status(400).json({
        success: false,
        message: "Invalid data",
      });
    } else {
      delete result.rows[0].password;
      res.status(201).json({
        success: true,
        message: "User registered successfully",
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

export const authController = {
  create,
};
