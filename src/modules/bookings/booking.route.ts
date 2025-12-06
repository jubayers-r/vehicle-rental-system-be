import { Router, Request, Response } from "express";
import { pool } from "../../config/db";
import {
  badRequest,
  conflictResponse,
  postSuccessful,
} from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(["admin", "customer"]), bookingControllers.create);

export const bookingRoutes = router;
