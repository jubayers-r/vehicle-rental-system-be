import { Router, Request, Response } from "express";
import { bookingControllers } from "./booking.controller";
import auth from "../../middleware/auth";

const router = Router();

router.post("/", auth(["admin", "customer"]), bookingControllers.create);

router.get("/", auth(["admin", "customer"]), bookingControllers.findAll);

router.put(
  "/:bookingId",
  auth(["admin", "customer"]),
  bookingControllers.updateStatus,
);

export const bookingRoutes = router;
