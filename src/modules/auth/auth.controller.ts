import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import { authServices } from "./auth.service";
import {
  badRequest,
  notFound,
  okResponse,
  postSuccessful,
  unauthorizedRequest,
} from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";
import { pool } from "../../config/db";
import jwt from "jsonwebtoken";
import config from "../../config";

const create = asyncHandler(async (req: Request, res: Response) => {
  const { password, ...rest } = req.body;

  const hashedPass = await bcrypt.hash(password, 10);

  const userData = {
    ...rest,
    password: hashedPass,
  };

  const result = await authServices.createUser(userData);
  if (!result.rows.length) {
    return badRequest(res);
  }

  delete result.rows[0].password;

  postSuccessful(res, "User registered", result.rows[0]);
});

const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const result = await authServices.loginUser(email);

  if (!result.rows.length) {
    return notFound(res, "User");
  }

  const user = result.rows[0];

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return unauthorizedRequest(res, "credentials");
  }
  delete user.id;
  delete user.password;
  delete user.iat;
  delete user.exp;

  const secret = config.jwt_secret;
  const accessToken = jwt.sign(user, secret as string, {
    expiresIn: "15m",
  });
  const refreshToken = jwt.sign(user, secret as string, {
    expiresIn: "7d",
  });

  okResponse(res, "User logged in successfully", { accessToken, refreshToken });

  return { accessToken, refreshToken };
});

export const authController = {
  create,
  login,
};
