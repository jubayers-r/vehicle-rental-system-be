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

const router = Router();
router.post("/", auth(["admin"]), vehicleControllers.create);

router.get("/", vehicleControllers.findAll);

router.get("/:vehicleId", vehicleControllers.findOne);



export const vehicleRoutes = router;
