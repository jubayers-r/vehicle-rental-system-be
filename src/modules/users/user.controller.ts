import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
} from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await userServices.getAllUsers();

  if (!result.rows.length) {
    notFound(res, "Users");
  }
  result.rows.forEach((row) => {
    delete row.password;
  });

  okResponse(res, "Users retrieved successfully", result.rows);
  return result;
});

const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.deleteById(req.params.userId!);
  if (!result.rowCount) {
    notFound(res, "User");
  }
  okResponse(res, "User deleted successfully");
});

const updateOne = asyncHandler(async (req: Request, res: Response) => {
  const uid = req.params.userId;
  if (!Object.keys(req.body).length) {
    badRequest(res);
  }

  for (const key in req.body) {
    await userServices.updateById(uid!, req.body, key);
  }
  const result = await userServices.getById(uid!);
  delete result.rows[0].password;

  okResponse(res, "User updated successfully", result.rows);
});
export const userControllers = {
  findAll,
  deleteOne,
  updateOne,
};
