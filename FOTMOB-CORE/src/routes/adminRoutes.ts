import { Router } from "express";
import { requireApiKey } from "../middleware/apiKeyAuth";
import { validate } from "../middleware/validation";
import { CreateMatchEventSchema, UpdateMatchStatusSchema } from "../types";
import { recordMatchEvent, updateMatchStatus } from "../controllers/AdminController";
import { createLeague } from "../controllers/LeagueController";
import { CreateLeagueSchema } from "../types";
import { createTeam } from "../controllers/TeamController";
import { CreateTeamSchema } from "../types";
import { createPlayer } from "../controllers/PlayerController";
import { CreatePlayerSchema } from "../types";
import { createMatch } from "../controllers/MatchController";
import { CreateMatchSchema } from "../types";
import { createTransfer } from "../controllers/TransferController";
import { CreateTransferSchema } from "../types";
import { createArticle } from "../controllers/NewsController";
import { CreateNewsSchema } from "../types";

const router = Router();

router.use(requireApiKey);

router.post("/leagues", validate(CreateLeagueSchema), createLeague);
router.post("/teams", validate(CreateTeamSchema), createTeam);
router.post("/players", validate(CreatePlayerSchema), createPlayer);
router.post("/matches", validate(CreateMatchSchema), createMatch);
router.post("/matches/:matchId/events", validate(CreateMatchEventSchema), recordMatchEvent);
router.patch("/matches/:matchId/status", validate(UpdateMatchStatusSchema), updateMatchStatus);
router.post("/transfers", validate(CreateTransferSchema), createTransfer);
router.post("/news", validate(CreateNewsSchema), createArticle);

export default router;
