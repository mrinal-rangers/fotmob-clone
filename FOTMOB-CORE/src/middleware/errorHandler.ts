import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error("Error:", err.message);

  if (err.message === "Match not found") {
    return res.status(404).json({ error: err.message });
  }

  if (err.message === "Match is already finished") {
    return res.status(400).json({ error: err.message });
  }

  if (err.message === "Invalid credentials") {
    return res.status(401).json({ error: err.message });
  }

  if (err.message.includes("already exists")) {
    return res.status(409).json({ error: err.message });
  }

  return res.status(500).json({ error: "Internal server error" });
}
