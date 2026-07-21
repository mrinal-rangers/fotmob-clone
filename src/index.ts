import "./config/env";
import "express-async-errors";
import express from "express";
import cors from "cors";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { config } from "./config/env";

const app = express();

app.use(cors({ origin: config.server.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString(), env: config.env.name });
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(config.server.port, () => {
  console.log(`[${config.env.name}] Server running on http://localhost:${config.server.port}`);
  console.log(`[${config.env.name}] Health check: http://localhost:${config.server.port}/health`);
  console.log(`[${config.env.name}] API base: http://localhost:${config.server.port}/api`);
  console.log(`[${config.env.name}] Log level: ${config.log.level}`);
});

export default app;
