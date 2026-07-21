import { Request, Response } from "express";
import { AuthService } from "../services/AuthService";

const authService = new AuthService();

export async function googleSignIn(req: Request, res: Response) {
  const { idToken } = req.body;
  const result = await authService.googleSignIn(idToken);
  res.json(result);
}
