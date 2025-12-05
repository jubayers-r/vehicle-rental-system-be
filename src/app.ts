import express, { Application, Request, Response, Router } from "express";
import { initDB } from "./config/db";

const app: Application = express();
const apiV1 = Router();


app.use("/api/v1/", apiV1);
app.use(express.json());

// "/api/v1/" routes
apiV1.get("/", (_req: Request, res: Response) => {
  res.send("Hello from vehicle rental system nested api v1 route ");
});

// db
initDB()
  .then(() => console.log("DB initiated"))
  .catch((err) => {
    console.error(err);
  });

export default app;
