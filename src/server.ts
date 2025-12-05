import dotenv from "dotenv";
import express, { Application, Request, Response, Router } from "express";
import path from "path";
import { Pool } from "pg";

const app: Application = express();
const port = process.env.PORT || 5000;
dotenv.config({ path: path.join(process.cwd(), ".env") });

const apiV1 = Router();
app.use(express.json());
app.use("/api/v1/", apiV1);

apiV1.get("/", (req: Request, res: Response) => {
  res.send("Hello vehicle rental system nested api v1 route ");
});

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDB = async () => {
  await pool.query(`

                `);
};

initDB()
  .then(() => console.log("DB initiated"))
  .catch((err) => {
    console.error(err);
  });

app.listen(port, () => {
  console.log("app is getting listented at port", port);
});
