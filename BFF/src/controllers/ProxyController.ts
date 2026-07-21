import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { proxy } from "../services/ProxyService";

export async function proxyGet(req: AuthRequest, res: Response) {
  const data = await proxy.get(req.path.replace(/^\/api/, "") + "?" + new URLSearchParams(req.query as any).toString());
  res.json(data);
}

export async function proxyPost(req: AuthRequest, res: Response) {
  const data = await proxy.post(req.path.replace(/^\/api/, ""), req.body);
  res.status(201).json(data);
}

export async function proxyPatch(req: AuthRequest, res: Response) {
  const data = await proxy.patch(req.path.replace(/^\/api/, ""), req.body);
  res.json(data);
}

export async function proxyDelete(req: AuthRequest, res: Response) {
  const data = await proxy.delete(req.path.replace(/^\/api/, ""));
  res.json(data);
}
