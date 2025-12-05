import express, { Application, Request, Response, Router } from "express";
import { initDB } from "./config/db";
import { userRoutes } from "./modules/users/user.route";
import { vehicleRoutes } from "./modules/vehicles/vehicle.route";
import { bookingRoutes } from "./modules/bookings/booking.route";
import { authRoutes } from "./modules/auth/auth.route";

const app: Application = express();
app.use(express.json());


const apiV1 = Router();
app.use("/api/v1/", apiV1);


// "/api/v1/" routes
apiV1.get("/", (_req: Request, res: Response) => {
  res.send("Hello from vehicle rental system nested api v1 route ");
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

export default app;
