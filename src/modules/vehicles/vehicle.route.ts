import { Router, Request, Response } from "express";
import { pool } from "../../config/db";
import { badRequest, postSuccessful } from "../../utils/responseHandler";
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = Router();
router.post("/", auth(["admin"]), vehicleControllers.create);


export const vehicleRoutes = router;
