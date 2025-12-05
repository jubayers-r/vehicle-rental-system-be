import { Request, Response } from "express";
import { userServices } from "./user.service";
import { pool } from "../../config/db";
import {
  badRequest,
  notFound,
  okResponse,
  serverError,
} from "../../utils/responseHandler";

const findAll = async (_req: Request, res: Response) => {
  const result = await userServices.getAllUsers();

  try {
    if (!result.rows.length) {
      notFound(res, "Users");
    } else {
      result.rows.forEach((row) => {
        delete row.password;
      });

      okResponse(res, "Users retrieved successfully", result.rows);
    }
  } catch (error: any) {
    serverError(res, error);
  }
  return result;
};

const deleteOne = async (req: Request, res: Response) => {
  const result = await userServices.deleteById(req.params.userId!);

  try {
    if (!result.rowCount) {
      notFound(res, "User");
    } else {
      okResponse(res, "User deleted successfully");
    }
  } catch (error: any) {
    serverError(res, error);
  }
};

const updateOne = async (req: Request, res: Response) => {
  const uid = req.params.userId;

  try {
    if (!Object.keys(req.body).length) {
      badRequest(res);
    } else {
      for (const key in req.body) {
        await userServices.updateById(uid!, req.body, key);
      }
      const result = await userServices.getById(uid!);
      delete result.rows[0].password;

      okResponse(res, "User updated successfully", result.rows);
    }
  } catch (error: any) {
    serverError(res, error);
  }
};

export const userControllers = {
  findAll,
  deleteOne,
  updateOne,
};
