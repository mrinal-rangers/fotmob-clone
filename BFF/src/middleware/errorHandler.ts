import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("[BFF] Error:", err.message);

  if (err.message.includes("Invalid or expired session")) {
    return res.status(401).json({ error: err.message });
  }
  if (err.message.includes("Core API error")) {
    return res.status(502).json({ error: "Upstream service error" });
  }

  return res.status(500).json({ error: "Internal server error" });
}
