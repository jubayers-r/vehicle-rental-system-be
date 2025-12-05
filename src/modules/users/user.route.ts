import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

// admin_access_only middleware needed
router.get("/", userControllers.findAll);

export const userRoutes = router;
