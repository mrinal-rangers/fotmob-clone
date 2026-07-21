import { Router } from "express";
import {
  createPlayer,
  getPlayer,
  listPlayers,
  getPlayerStats,
  getTopScorers,
  getTopAssisters,
} from "../controllers/PlayerController";

const router = Router();

router.get("/", listPlayers);
router.get("/:id", getPlayer);
router.get("/:id/stats", getPlayerStats);

export default router;

export function registerLeaguePlayerRoutes(router: Router) {
  router.get("/leagues/:leagueId/top-scorers", getTopScorers);
  router.get("/leagues/:leagueId/top-assisters", getTopAssisters);
}
