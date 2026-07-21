import { Request, Response } from "express";
import { SearchService } from "../services/SearchService";

const searchService = new SearchService();

export async function search(req: Request, res: Response) {
  const q = req.query.q as string;
  const type = req.query.type as any;
  if (!q) return res.status(400).json({ error: "Query parameter 'q' is required" });

  const results = await searchService.search(q, type);
  res.json(results);
}
