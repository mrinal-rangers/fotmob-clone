import { Router } from "express";
import { createMatch, getMatch, listMatches, getLiveMatches, getMatchEvents } from "../controllers/MatchController";

const router = Router();

router.get("/", listMatches);
router.get("/live", getLiveMatches);
router.get("/:id", getMatch);
router.get("/:id/events", getMatchEvents);

export default router;
