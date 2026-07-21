import dotenv from "dotenv";
import path from "path";

const nodeEnv = process.env.NODE_ENV || "development";

const envFile = nodeEnv === "production" ? ".env.prod" : ".env";

dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });

dotenv.config({ path: path.resolve(__dirname, "../../", ".env"), override: true });

export const config = {
  env: {
    name: process.env.FOTMOB_ENV || nodeEnv,
    isDev: (process.env.FOTMOB_ENV || nodeEnv) === "development",
    isProd: (process.env.FOTMOB_ENV || nodeEnv) === "production",
  },

  server: {
    port: parseInt(process.env.FOTMOB_PORT || "3000", 10),
    corsOrigin: process.env.FOTMOB_CORS_ORIGIN || "http://localhost:5173",
  },

  db: {
    url: process.env.FOTMOB_DB_URL || "",
  },

  jwt: {
    secret: process.env.FOTMOB_JWT_SECRET || "",
    expiresIn: process.env.FOTMOB_JWT_EXPIRES_IN || "24h",
  },

  auth: {
    google: {
      clientId: process.env.FOTMOB_AUTH_GOOGLE_CLIENT_ID || "",
    },
    admin: {
      emails: (process.env.FOTMOB_AUTH_ADMIN_EMAILS || "")
        .split(",")
        .map((e: string) => e.trim())
        .filter(Boolean),
    },
  },

  seed: {
    admin: {
      email: process.env.FOTMOB_SEED_ADMIN_EMAIL || "admin@fotmob.com",
      password: process.env.FOTMOB_SEED_ADMIN_PASSWORD || "admin123",
    },
  },

  log: {
    level: process.env.FOTMOB_LOG_LEVEL || (process.env.FOTMOB_ENV === "production" ? "info" : "debug"),
  },
};
