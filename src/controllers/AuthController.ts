import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export async function register(req: Request, res: Response) {
  const admin = await authService.register(req.body);
  res.status(201).json({ id: admin.id, email: admin.email, name: admin.name, role: admin.role });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;
  const result = await authService.login(email, password);
  res.json(result);
}

export async function googleSignIn(req: Request, res: Response) {
  try {
    const { idToken } = req.body;
    const result = await authService.googleSignIn(idToken);
    res.json(result);
  } catch (err: any) {
    if (err.message?.includes("Wrong number of segments") || err.message?.includes("Invalid Google token")) {
      return res.status(401).json({ error: "Invalid Google token" });
    }
    if (err.message === "Google Sign-In is not configured (missing GOOGLE_CLIENT_ID)") {
      return res.status(500).json({ error: err.message });
    }
    if (err.message?.startsWith("Unauthorized")) {
      return res.status(403).json({ error: err.message });
    }
    throw err;
  }
}
