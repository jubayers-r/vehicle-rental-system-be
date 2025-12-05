import { Router, Request, Response } from "express";

const router = Router();

router.get("/", async(_req: Request, res: Response) => {
res.send("welcome to /api/v1/bookings route")
})

export const bookingRoutes = router;