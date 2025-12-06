import { Router, Request, Response } from "express";
import { pool } from "../../config/db";
import {
  badRequest,
  conflictResponse,
  notFound,
  okResponse,
  postSuccessful,
  unauthorizedRequest,
} from "../../utils/responseHandler";
import { asyncHandler } from "../../utils/asyncHandler";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(["admin", "customer"]), bookingControllers.create);

router.get("/", auth(["admin", "customer"]), bookingControllers.findAll);

export const bookingRoutes = router;
