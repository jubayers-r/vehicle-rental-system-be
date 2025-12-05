import { Router } from "express";
import { userControllers } from "./user.controller";

const router = Router();

router.post("/", userControllers.create);

// admin_access_only middleware needed
router.get("/", userControllers.findAll);

export const userRoutes = router;
