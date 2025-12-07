import express, { Application, Request, Response, Router } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { vehicleRoutes } from "./modules/vehicles/vehicle.route";
import { bookingRoutes } from "./modules/bookings/booking.route";
import { authRoutes } from "./modules/auth/auth.route";
import { notFound } from "./utils/responseHandler";

const app: Application = express();
app.use(express.json());

const apiV1 = Router();
app.use("/api/v1/", apiV1);

// "/api/v1/" routes
apiV1.get("/", (_req: Request, res: Response) => {
  res.send("Don't worry, the app is running like butter smooth.");
});
apiV1.use("/users", userRoutes);
apiV1.use("/vehicles", vehicleRoutes);
apiV1.use("/bookings", bookingRoutes);
apiV1.use("/auth", authRoutes);

// db
initDB()
  .then(() => console.log("DB initiated"))
  .catch((err) => {
    console.error(err);
  });

//route not found
app.use((req: Request, res: Response) => {
  return notFound(
    res,
    `route '${req.path}' not found. Navigate from path '/api/v1/your_intended_route'`,
  );
});

export default app;
