import { pool } from "../../config/db";
import { asyncHandler } from "../../utils/asyncHandler";
import {
  badRequest,
  conflictResponse,
  notFound,
  okResponse,
  postSuccessful,
  unauthorizedRequest,
} from "../../utils/responseHandler";
import { Request, Response } from "express";
import { bookingService } from "./booking.service";
import { vehicleServices } from "../vehicles/vehicle.service";

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

  const vehicleQuery = await vehicleServices.vehicleQuery(vehicle_id);

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
  const updateCarStatus = await vehicleServices.updateCarStatus(
    vehicle_id,
    "booked",
  );

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

const findAll = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    return unauthorizedRequest(res, "token");
  }

  if (req.user?.role === "admin") {
    const result = await bookingService.getAllBookings();

    if (!result.rows.length) {
      return notFound(res, "Bookings");
    }

    return okResponse(res, "Bookings retrieved successfully", result.rows);
  } else {
    const result = await bookingService.getById(req.user?.id);

    if (!result.rows.length) {
      return notFound(res, "Your bookings");
    }

    return okResponse(res, "Your bookings retrieved successfully", result.rows);
  }
});

//

const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body;

  const bid = req.params.bookingId;

  const bookingsQuery = await bookingService.bookingsQuery(bid!);

  if (!bookingsQuery.rows.length) {
    return notFound(res, "Booking");
  }

  const { vehicle_id, rent_start_date } = bookingsQuery.rows[0];

  // who came token status check
  const adminCame = status === "returned" && req.user?.role === "admin";
  const customerCame = status === "cancelled" && req.user?.role === "customer";

  const newStatus = adminCame ? "returned" : customerCame ? "cancelled" : null;

  // no status input request
  if (
    (status !== "cancelled" && status !== "returned") ||
    (status === "cancelled" && req.user?.role === "admin") ||
    (status === "returned" && req.user?.role === "customer") ||
    !newStatus
  ) {
    return badRequest(res);
  }

  // common responses
  const bookingStatusUpdate = await bookingService.cancelBooking(
    newStatus,
    bid!,
  );

  let carStatusUpdate;
  let successPayload;

  if (bookingStatusUpdate.rows) {
    carStatusUpdate = await vehicleServices.updateCarStatus(
      vehicle_id!,
      "available",
    );

    successPayload = {
      ...bookingStatusUpdate.rows[0],
      vehicle: {
        availability_status: "available",
      },
    };
  }

  //admin response
  if (
    adminCame &&
    carStatusUpdate!.rows.length &&
    bookingStatusUpdate.rows.length
  ) {
    return okResponse(
      res,
      "Booking marked as returned. Vehicle is now available",
      successPayload,
    );
  }

  //user response

  if (customerCame) {
    const today = Date.now();
    const date = new Date(rent_start_date).getTime();

    if (today >= date) {
      return conflictResponse(
        res,
        "Cancellation is only possible before before start date only",
      );
    } else if (
      carStatusUpdate!.rows.length &&
      bookingStatusUpdate.rows.length
    ) {
      return okResponse(res, "Booking cancelled successfully", successPayload);
    }
    return notFound(res, "Booking");
  }

  // public (without token/with invalid token) response

  return unauthorizedRequest(res, "access");
});

export const bookingControllers = { create, findAll, updateStatus };
