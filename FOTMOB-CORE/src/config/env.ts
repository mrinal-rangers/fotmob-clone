import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });
dotenv.config({ path: path.resolve(__dirname, "../../", ".env"), override: true });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4000", 10),
  db: { url: process.env.DATABASE_URL || "" },
  core: { apiKey: process.env.CORE_API_KEY || "" },
  cors: { origin: process.env.CORS_ORIGIN || "http://localhost:4001" },
};
