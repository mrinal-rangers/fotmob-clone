import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("[BFF] Error:", err.message);

  if (err.message === "Unauthorized: this email is not registered as an admin") {
    return res.status(403).json({ error: err.message });
  }
  if (err.message.includes("Invalid Google token") || err.message === "Invalid or expired token") {
    return res.status(401).json({ error: err.message });
  }
  if (err.message.includes("Core API error")) {
    return res.status(502).json({ error: "Upstream service error" });
  }

  return res.status(500).json({ error: "Internal server error" });
}
