import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  db_string: process.env.DATABASE_URL,
  port: process.env.PORT || 5000,
  // for future refrence console.log(require('crypto').randomBytes(32).toString('hex'))
  jwt_secret: process.env.JWT_SECRET,
};

export default config;
