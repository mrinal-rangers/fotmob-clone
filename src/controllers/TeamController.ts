import { Request, Response } from "express";
import { TeamService } from "../services/TeamService";

const teamService = new TeamService();

export async function createTeam(req: Request, res: Response) {
  const team = await teamService.createTeam(req.body);
  res.status(201).json(team);
}

export async function getTeam(req: Request, res: Response) {
  const team = await teamService.getTeam(req.params.id);
  if (!team) return res.status(404).json({ error: "Team not found" });
  res.json(team);
}

export async function listTeams(_req: Request, res: Response) {
  const teams = await teamService.listTeams();
  res.json(teams);
}

export async function getTeamMatches(req: Request, res: Response) {
  const data = await teamService.getTeamMatches(req.params.id);
  if (!data) return res.status(404).json({ error: "Team not found" });
  res.json(data);
}

export async function getTeamSquad(req: Request, res: Response) {
  const squad = await teamService.getTeamSquad(req.params.id);
  if (!squad) return res.status(404).json({ error: "Team not found" });
  res.json(squad);
}
