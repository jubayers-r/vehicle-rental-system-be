import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import {
  badRequest,
  postSuccessful,
  serverError,
} from "../../utils/responseHandler";

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
      badRequest(res);
    } else {
      delete result.rows[0].password;

      postSuccessful(res, "User registered successfully", result.rows);
    }
  } catch (error: any) {
    serverError(res, error);
  }
};

export const authController = {
  create,
};
