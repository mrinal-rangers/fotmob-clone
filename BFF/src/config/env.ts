import dotenv from "dotenv";
import path from "path";

const envFile = process.env.NODE_ENV === "production" ? ".env.prod" : ".env";
dotenv.config({ path: path.resolve(__dirname, "../../", envFile) });
dotenv.config({ path: path.resolve(__dirname, "../../", ".env"), override: true });

export const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "4001", 10),
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",

  core: {
    url: process.env.CORE_API_URL || "http://localhost:4000",
    apiKey: process.env.CORE_API_KEY || "",
  },

  jwt: {
    secret: process.env.JWT_SECRET || "fallback-bff-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },

  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || "",
  },

  auth: {
    adminEmails: (process.env.ADMIN_EMAILS || "").split(",").map((s: string) => s.trim()).filter(Boolean),
  },
};
