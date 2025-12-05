import { Router, Request, Response } from "express";
import { authController } from "./auth.controller";

const router = Router();
router.get("/", async (_req: Request, res: Response) => {
  res.send("welcome to /api/v1/auth route");
});

router.post("/signup", authController.create);

export const authRoutes = router;
