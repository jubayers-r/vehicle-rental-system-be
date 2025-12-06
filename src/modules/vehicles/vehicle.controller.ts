import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  badRequest,
  notFound,
  okResponse,
  postSuccessful,
} from "../../utils/responseHandler";
import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleServices.createVehicle(req.body);

  if (!result.rows.length) {
    badRequest(res);
  }

  postSuccessful(res, "Vehicle created", result.rows[0]);
});

const findAll = asyncHandler(async (_req: Request, res: Response) => {
  const result = await vehicleServices.getAllVehicles();

  if (!result.rows.length) {
    notFound(res, "Vehicles");
  }

  okResponse(res, "Vehicles retrieved successfully", result.rows);
});

const findOne = asyncHandler(async (req: Request, res: Response) => {
  const vid = req.params.vehicleId;

  const result = await vehicleServices.getById(vid!);

  if (!result.rows.length) {
    return notFound(res, "Vehicle");
  }

  okResponse(res, "Vehicle retrieved successfully", result.rows[0]);
});

export const vehicleControllers = { create, findAll, findOne };
