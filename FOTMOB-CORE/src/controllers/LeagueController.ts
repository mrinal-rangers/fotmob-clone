import { Request, Response } from "express";
import { LeagueService } from "../services/LeagueService";

const leagueService = new LeagueService();

export async function createLeague(req: Request, res: Response) {
  const league = await leagueService.createLeague(req.body);
  res.status(201).json(league);
}

export async function getLeague(req: Request, res: Response) {
  const league = await leagueService.getLeague(req.params.id);
  if (!league) return res.status(404).json({ error: "League not found" });
  res.json(league);
}

export async function listLeagues(_req: Request, res: Response) {
  const leagues = await leagueService.listLeagues();
  res.json(leagues);
}

export async function getStandings(req: Request, res: Response) {
  const standings = await leagueService.getStandings(req.params.id);
  res.json(standings);
}
