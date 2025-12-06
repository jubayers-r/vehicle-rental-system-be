import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  badRequest,
  conflictResponse,
  notFound,
  postSuccessful,
} from "../../utils/responseHandler";
import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const create = asyncHandler(async (req: Request, res: Response) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = req.body;

  // --- Validate dates ---
  let date1 = new Date(rent_start_date);
  let date2 = new Date(rent_end_date);

  if (isNaN(date1.getTime()) || isNaN(date2.getTime())) {
    return badRequest(res);
  }

  const totalUsingDays =
    (date2.getTime() - date1.getTime()) / (1000 * 3600 * 24);

  if (totalUsingDays <= 0) {
    return badRequest(res);
  }

  // --- Query vehicle directly ---

  const vehicleQuery = await bookingService.vehicleQuery(vehicle_id);

  if (!vehicleQuery.rows.length) {
    return notFound(res, "Vehicle");
  }

  const { vehicle_name, daily_rent_price, availability_status } =
    vehicleQuery.rows[0];

  if (availability_status !== "available") {
    return conflictResponse(res, "Vehicle is not available for booking");
  }

  // --- Calculate total price ---
  const total_price = totalUsingDays * daily_rent_price;

  // --- Create booking ---
  const bookingData = {
    customer_id,
    vehicle_id,
    rent_start_date,
    rent_end_date,
    total_price,
  };
  const result = await bookingService.createBooking(bookingData);

  if (!result.rows.length) {
    return badRequest(res);
  }

  // --- Update vehicle status ---
  const updateCarStatus = await bookingService.updateCarStatus(vehicle_id);

  if (!updateCarStatus.rows.length) {
    return conflictResponse(res, "Vehicle is not available for booking");
  }

  // --- Successful payload ---
  const resultPayload = {
    ...result.rows[0],
    rent_start_date: rent_start_date,
    rent_end_date: rent_end_date,
    vehicle: {
      vehicle_name: vehicle_name,
      daily_rent_price: daily_rent_price,
    },
  };

  return postSuccessful(res, "Booking created", resultPayload);
});

export const bookingControllers = { create };
