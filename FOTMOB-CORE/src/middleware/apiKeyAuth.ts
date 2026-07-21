import { Request, Response, NextFunction } from "express";
import { config } from "../config/env";

export function requireApiKey(req: Request, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || apiKey !== config.core.apiKey) {
    return res.status(401).json({ error: "Invalid or missing API key" });
  }
  next();
}
