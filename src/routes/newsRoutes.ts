import { Router } from "express";
import { getArticle, listArticles } from "../controllers/NewsController";

const router = Router();

router.get("/", listArticles);
router.get("/:id", getArticle);

export default router;
