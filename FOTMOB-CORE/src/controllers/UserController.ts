import { Request, Response } from "express";
import { UserService } from "../services/UserService";
import { FollowEntityType } from "@prisma/client";

const userService = new UserService();

export async function syncUser(req: Request, res: Response) {
  const user = await userService.syncUser(req.body);
  res.json(user);
}

export async function getUser(req: Request, res: Response) {
  const user = await userService.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function getUserByClerkId(req: Request, res: Response) {
  const user = await userService.getUserByClerkId(req.params.clerkId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
}

export async function updatePreferences(req: Request, res: Response) {
  const user = await userService.updatePreferences(req.params.id, req.body);
  res.json(user);
}

export async function getFollows(req: Request, res: Response) {
  const follows = await userService.getFollows(req.params.id);
  res.json(follows);
}

export async function getFollowsByType(req: Request, res: Response) {
  const entityType = req.params.entityType as FollowEntityType;
  const follows = await userService.getFollowsByType(req.params.id, entityType);
  res.json(follows);
}

export async function followEntity(req: Request, res: Response) {
  const { entityType, entityId } = req.body;
  const follow = await userService.follow(req.params.id, entityType, entityId);
  res.status(201).json(follow);
}

export async function unfollowEntity(req: Request, res: Response) {
  await userService.unfollow(req.params.id, req.params.followId);
  res.status(204).send();
}
