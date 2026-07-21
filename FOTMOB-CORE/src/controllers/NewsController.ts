import { Request, Response } from "express";
import { NewsService } from "../services/NewsService";

const newsService = new NewsService();

export async function createArticle(req: Request, res: Response) {
  const article = await newsService.createArticle(req.body);
  res.status(201).json(article);
}

export async function getArticle(req: Request, res: Response) {
  const article = await newsService.getArticle(req.params.id);
  if (!article) return res.status(404).json({ error: "Article not found" });
  res.json(article);
}

export async function listArticles(req: Request, res: Response) {
  const filters: any = {};
  if (req.query.category) filters.category = req.query.category as string;
  if (req.query.leagueId) filters.leagueId = req.query.leagueId as string;
  const articles = await newsService.listArticles(filters);
  res.json(articles);
}
