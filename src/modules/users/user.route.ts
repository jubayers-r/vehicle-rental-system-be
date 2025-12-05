import { Router } from "express";
import { userControllers } from "./user.controller";
import { pool } from "../../config/db";
import { Request, Response } from "express";

const router = Router();

// admin_access_only middleware needed
router.get("/", userControllers.findAll);

// admin_access_only middleware needed
router.delete("/:userId", userControllers.deleteOne);

// admin or customer(for own account) middleware needed
router.put("/:userId", userControllers.updateOne);

export const userRoutes = router;
