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

  // pull data
  let date1 = Number(new Date(rent_start_date));
  let date2 = Number(new Date(rent_end_date));
  const totalUsingDays = (date2 - date1) / 1000 / 3600 / 24;

  const vehicleIdExists = await pool.query(`
    SELECT id FROM vehicles
    `);

  const ids = vehicleIdExists.rows.map((v) => v.id);

  if (ids.includes(vehicle_id)) {
    const vehicleQuery = await bookingService.vehicleQuery(vehicle_id);
    const { vehicle_name, daily_rent_price, availability_status } =
      vehicleQuery.rows[0];

    const total_price = totalUsingDays * daily_rent_price;
    // pull data

    if (availability_status === "available") {
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
      const updateCarStatus = await bookingService.updateCarStatus(vehicle_id);
      if (!updateCarStatus.rows.length) {
        return conflictResponse(res, "Vehicle is not available for booking");
      } else {
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
      }
    } else {
      return conflictResponse(res, "Vehicle is not available for booking");
    }
  } else {
    return notFound(res, "Vehicle");
  }
});

export const bookingControllers = { create };
