import { Request, Response } from "express";
import { MatchService } from "../services/MatchService";

const matchService = new MatchService();

export async function createMatch(req: Request, res: Response) {
  const match = await matchService.createMatch(req.body);
  res.status(201).json(match);
}

export async function getMatch(req: Request, res: Response) {
  const match = await matchService.getMatch(req.params.id);
  if (!match) return res.status(404).json({ error: "Match not found" });
  res.json(match);
}

export async function listMatches(req: Request, res: Response) {
  const filters: any = {};
  if (req.query.leagueId) filters.leagueId = req.query.leagueId as string;
  if (req.query.teamId) filters.teamId = req.query.teamId as string;
  if (req.query.status) filters.status = req.query.status as string;
  const matches = await matchService.listMatches(filters);
  res.json(matches);
}

export async function getLiveMatches(_req: Request, res: Response) {
  const matches = await matchService.getLiveMatches();
  res.json(matches);
}

export async function getMatchEvents(req: Request, res: Response) {
  const events = await matchService.getMatchEvents(req.params.id);
  res.json(events);
}
