import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import { badRequest, postSuccessful } from "../../utils/responseHandler";
import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";

const create = asyncHandler(async (req: Request, res: Response) => {
  const result = await vehicleServices.createVehicle(req.body);

  if (!result.rows.length) {
    badRequest(res);
  }

  postSuccessful(res, "Vehicle created", result.rows[0]);
});

export const vehicleControllers = { create };
