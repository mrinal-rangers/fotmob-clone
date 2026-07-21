import { Response } from "express";
import { AuthRequest } from "../middleware/clerkAuth";
import { proxy } from "../services/ProxyService";

export async function getMe(req: AuthRequest, res: Response) {
  res.json(req.user);
}

export async function updatePreferences(req: AuthRequest, res: Response) {
  const user = await proxy.patch(`/users/${req.user!.id}/preferences`, req.body);
  res.json(user);
}

export async function getFollows(req: AuthRequest, res: Response) {
  const follows = await proxy.get(`/users/${req.user!.id}/follows`);
  res.json(follows);
}

export async function followEntity(req: AuthRequest, res: Response) {
  const follow = await proxy.post(`/users/${req.user!.id}/follows`, req.body);
  res.status(201).json(follow);
}

export async function unfollowEntity(req: AuthRequest, res: Response) {
  await proxy.delete(`/users/${req.user!.id}/follows/${req.params.followId}`);
  res.status(204).send();
}
