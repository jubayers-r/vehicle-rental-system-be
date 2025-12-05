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

    // real misfortunate CREATE TYPE works but CREATE TYPE IF NOT EXISTS doesnt work on this cloud
    // couldnt findout the reason so had to go with the old time sql syntax

    await pool.query(
      `
DO $$
   BEGIN
    -- user_role
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
      CREATE TYPE user_role AS ENUM ('admin', 'customer');
    END IF;

    -- car_types
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_types') THEN
      CREATE TYPE car_types AS ENUM ('car', 'bike', 'van', 'SUV');
    END IF;

    -- car_availability
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'car_availability') THEN
      CREATE TYPE car_availability AS ENUM ('available', 'booked');
    END IF;

    -- booking_status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'booking_status') THEN
      CREATE TYPE booking_status AS ENUM ('active', 'cancelled', 'returned');
    END IF;
  END
  $$;
      `,
    );

    await pool.query(`
          CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          email TEXT UNIQUE NOT NULL CHECK (email ~ '[a-z]'),
          password TEXT NOT NULL,
            CHECK (char_length(password) >= 6),
          phone VARCHAR(15) NOT NULL,
          role user_role NOT NULL DEFAULT 'customer'
          )
      `);

    await pool.query(`
          CREATE TABLE IF NOT EXISTS vehicles(
          id SERIAL PRIMARY KEY,
          vehicle_name VARCHAR(150) NOT NULL,
          type car_types NOT NULL,
          registration_number VARCHAR(100) UNIQUE NOT NULL,
          daily_rent_price INT NOT NULL,
              CHECK (daily_rent_price > 0),
          availability_status car_availability NOT NULL
          )
          `);
    await pool.query(`
          CREATE TABLE IF NOT EXISTS bookings(
          id SERIAL PRIMARY KEY,
          customer_id INT REFERENCES users(id) ON DELETE CASCADE,
          vehicle_id INT REFERENCES vehicles(id) ON DELETE CASCADE,
          rent_start_date DATE NOT NULL DEFAULT NOW() ,
          rent_end_date DATE NOT NULL,
             CHECK (rent_end_date > rent_start_date),
          total_price INT NOT NULL,
             CHECK (total_price > 0),
          status booking_status NOT NULL
          )
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
