import { Router } from "express";
import { createTeam, getTeam, listTeams, getTeamMatches, getTeamSquad } from "../controllers/TeamController";

const router = Router();

router.get("/", listTeams);
router.get("/:id", getTeam);
router.get("/:id/matches", getTeamMatches);
router.get("/:id/squad", getTeamSquad);

export default router;
