import { Router } from "express";
import leagueRoutes from "./leagueRoutes";
import teamRoutes from "./teamRoutes";
import playerRoutes from "./playerRoutes";
import matchRoutes from "./matchRoutes";
import transferRoutes from "./transferRoutes";
import newsRoutes from "./newsRoutes";
import searchRoutes from "./searchRoutes";
import adminRoutes from "./adminRoutes";
import { registerLeaguePlayerRoutes } from "./playerRoutes";

const router = Router();

router.use("/leagues", leagueRoutes);
router.use("/teams", teamRoutes);
router.use("/players", playerRoutes);
router.use("/matches", matchRoutes);
router.use("/transfers", transferRoutes);
router.use("/news", newsRoutes);
router.use("/search", searchRoutes);
router.use("/admin", adminRoutes);

registerLeaguePlayerRoutes(router);

export default router;
