import dotenv from "dotenv";
import path from "path";

const nodeEnv = process.env.NODE_ENV || "development";

const envFile = nodeEnv === "production" ? ".env.prod" : ".env";

dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });

dotenv.config({ path: path.resolve(__dirname, "../../", ".env"), override: true });

export const config = {
  port: parseInt(process.env.PORT || "3000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: (process.env.NODE_ENV || "development") !== "production",
  isProd: process.env.NODE_ENV === "production",

  database: {
    url: process.env.DATABASE_URL || "postgresql://localhost:5432/fotmob_clone",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "fallback-dev-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  cors: {
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  },

  logging: {
    level: process.env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug"),
  },
} as const;
