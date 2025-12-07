import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  badRequest,
  conflictResponse,
  notFound,
  okResponse,
  postSuccessful,
} from "../../utils/responseHandler";
import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.service";
import { bookingService } from "../bookings/booking.service";

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

const deleteOne = asyncHandler(async (req: Request, res: Response) => {
  const vid = req.params.vehicleId;

  const bookingExists = (await bookingService.getAllBookings()).rows
    .map((row) => row.status === "active" && row.vehicle_id)
    .toLocaleString()
    .includes(vid!);

  if (bookingExists) {
    return conflictResponse(res, "There's active bookings under this vehicle");
  }

  const result = await vehicleServices.deleteById(vid!);

  if (!result.rowCount) {
    return notFound(res, "Vehicle");
  }

  return okResponse(res, "Vehicle deleted successfully");
});

const updateVehicle = asyncHandler(async (req: Request, res: Response) => {
  const vid = req.params.vehicleId;

  if (!Object.keys(req.body).length) {
    return badRequest(res);
  }

  const allowedFields = [
    "vehicle_name",
    "type",
    "registration_number",
    "daily_rent_price",
    "availability_status",
  ];

  const filteredData: any = {};

  for (const key in req.body) {
    if (allowedFields.includes(key)) {
      filteredData[key] = req.body[key];
    }
  }

  if (!Object.keys(filteredData).length) {
    return badRequest(res);
  }

  const updatedUser = await vehicleServices.updateById(vid!, filteredData);

  delete updatedUser.password;

  return okResponse(res, "Vehicle updated successfully", updatedUser);
});

export const vehicleControllers = {
  create,
  findAll,
  findOne,
  deleteOne,
  updateVehicle,
};
