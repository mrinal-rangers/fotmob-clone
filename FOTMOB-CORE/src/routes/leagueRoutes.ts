import { Router } from "express";
import { createLeague, getLeague, listLeagues, getStandings } from "../controllers/LeagueController";

const router = Router();

router.get("/", listLeagues);
router.get("/:id", getLeague);
router.get("/:id/standings", getStandings);

export default router;
