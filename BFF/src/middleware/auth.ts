import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export interface AuthRequest extends Request {
  admin?: { sub: string; email: string; name: string; picture?: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication required" });
  }

  const decoded = authService.verifyToken(header.slice(7));
  if (!decoded) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  req.admin = decoded;
  next();
}
