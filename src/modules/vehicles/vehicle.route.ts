import { Router, Request, Response } from "express";
import { pool } from "../../config/db";
import {
  badRequest,
  notFound,
  okResponse,
  postSuccessful,
} from "../../utils/responseHandler";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";
import { asyncHandler } from "../../utils/asyncHandler";
import { vehicleServices } from "./vehicle.service";

const router = Router();
router.post("/", auth(["admin"]), vehicleControllers.create);

router.get("/", vehicleControllers.findAll);

router.get("/:vehicleId", vehicleControllers.findOne);

router.put("/:vehicleId", auth(["admin"]), vehicleControllers.updateVehicle);

// need to make it only work  when only no bookings  exist on specific id
router.delete("/:vehicleId", auth(["admin"]), vehicleControllers.deleteOne);

export const vehicleRoutes = router;
