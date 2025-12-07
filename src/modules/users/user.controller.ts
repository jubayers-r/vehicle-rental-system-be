import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";
import { badRequest, notFound, okResponse } from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await userServices.getAllUsers();

  if (!result.rows.length) {
    return notFound(res, "Users");
  }
  result.rows.forEach((row) => {
    return delete row.password;
  });

  okResponse(res, "Users retrieved successfully", result.rows);
  return result;
});

const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const result = await userServices.deleteById(req.params.userId!);
  if (!result.rowCount) {
    return notFound(res, "User");
  }
  okResponse(res, "User deleted successfully");
});

const updateOne = asyncHandler(async (req: Request, res: Response) => {
  const uid = req.params.userId;

  if (!Object.keys(req.body).length) {
    return badRequest(res);
  }

  const allowedFields = ["name", "email", "phone", "address"];

  //to keep it sql-injection free
  const filteredData: any = {};

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      filteredData[key] = req.body[key];
    }
  }

  if (!Object.keys(filteredData).length) {
    return badRequest(res);
  }

  const updatedUser = await userServices.updateById(uid!, filteredData);

  delete updatedUser.password;

  return okResponse(res, "User updated successfully", updatedUser);
});

export const userControllers = {
  findAll,
  deleteOne,
  updateOne,
};
