import "./config/env";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config/env";

const app = express();

app.use(cors({ origin: config.cors.origin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: config.nodeEnv });
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[${config.nodeEnv}] Server running on http://localhost:${config.port}`);
  console.log(`[${config.nodeEnv}] Health check: http://localhost:${config.port}/health`);
  console.log(`[${config.nodeEnv}] API base: http://localhost:${config.port}/api`);
  console.log(`[${config.nodeEnv}] Log level: ${config.logging.level}`);
});

export default app;
