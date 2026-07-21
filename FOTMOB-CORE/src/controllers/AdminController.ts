import { Request, Response } from "express";
import { MatchService } from "../services/MatchService";

const matchService = new MatchService();

export async function recordMatchEvent(req: Request, res: Response) {
  const { matchId } = req.params;
  const event = await matchService.recordEvent({
    matchId,
    ...req.body,
  });
  res.status(201).json(event);
}

export async function updateMatchStatus(req: Request, res: Response) {
  const { matchId } = req.params;
  const { status, homeScore, awayScore } = req.body;
  const match = await matchService.updateMatchStatus(matchId, status, homeScore, awayScore);
  res.json(match);
}
