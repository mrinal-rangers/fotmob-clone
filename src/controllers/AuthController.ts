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
