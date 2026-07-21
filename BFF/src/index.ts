import "./config/env";
import express from "express";
import cors from "cors";
import { config } from "./config/env";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() });
});

app.use("/api", routes);

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`[BFF] Running on port ${config.port}`);
  console.log(`[BFF] Proxying to Core at ${config.core.url}`);
});

export default app;
