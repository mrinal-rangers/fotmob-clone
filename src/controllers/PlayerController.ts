import { Request, Response } from "express";
import { PlayerService } from "../services/PlayerService";

const playerService = new PlayerService();

export async function createPlayer(req: Request, res: Response) {
  const player = await playerService.createPlayer(req.body);
  res.status(201).json(player);
}

export async function getPlayer(req: Request, res: Response) {
  const player = await playerService.getPlayer(req.params.id);
  if (!player) return res.status(404).json({ error: "Player not found" });
  res.json(player);
}

export async function listPlayers(_req: Request, res: Response) {
  const players = await playerService.listPlayers();
  res.json(players);
}

export async function getPlayerStats(req: Request, res: Response) {
  const stats = await playerService.getPlayerStats(req.params.id, req.query.leagueId as string);
  res.json(stats);
}

export async function getTopScorers(req: Request, res: Response) {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const scorers = await playerService.getTopScorers(req.params.leagueId, limit);
  res.json(scorers);
}

export async function getTopAssisters(req: Request, res: Response) {
  const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
  const assisters = await playerService.getTopAssisters(req.params.leagueId, limit);
  res.json(assisters);
}
