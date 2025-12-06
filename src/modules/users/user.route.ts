import { Router } from "express";
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = Router();

router.get("/", auth(["admin"]), userControllers.findAll);

router.delete("/:userId", auth(["admin"]), userControllers.deleteOne);

// admin or customer(for own account) middleware needed
router.put("/:userId", auth(["admin", "own"]), userControllers.updateOne);

export const userRoutes = router;
