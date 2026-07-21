import { Request, Response } from "express";
import { TransferService } from "../services/TransferService";

const transferService = new TransferService();

export async function createTransfer(req: Request, res: Response) {
  const transfer = await transferService.createTransfer(req.body);
  res.status(201).json(transfer);
}

export async function listTransfers(req: Request, res: Response) {
  const filters: any = {};
  if (req.query.teamId) filters.teamId = req.query.teamId as string;
  if (req.query.playerId) filters.playerId = req.query.playerId as string;
  const transfers = await transferService.listTransfers(filters);
  res.json(transfers);
}
