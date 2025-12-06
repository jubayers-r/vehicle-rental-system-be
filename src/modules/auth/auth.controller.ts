import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import { badRequest, postSuccessful } from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";

const create = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const userData = {
    ...rest,
    password: hashedPass,
  };

  const result = await authServices.createUser(userData);
  if (!result.rows.length) {
    badRequest(res);
  }

  delete result.rows[0].password;

  postSuccessful(res, "User registered successfully", result.rows[0]);
});

export const authController = {
  create,
};
