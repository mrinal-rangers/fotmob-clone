import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/auth";
import { proxyGet, proxyPost, proxyPatch, proxyDelete } from "../controllers/ProxyController";
import { getMe, updatePreferences, getFollows, followEntity, unfollowEntity } from "../controllers/UserController";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() }));

router.get("/auth/me", requireAuth, (req: any, res: Response) => res.json(req.user));

router.get("/users/me", requireAuth, getMe);
router.patch("/users/me/preferences", requireAuth, updatePreferences);
router.get("/users/me/follows", requireAuth, getFollows);
router.post("/users/me/follows", requireAuth, followEntity);
router.delete("/users/me/follows/:followId", requireAuth, unfollowEntity);

router.get("/*", requireAuth, proxyGet);
router.post("/*", requireAuth, proxyPost);
router.patch("/*", requireAuth, proxyPatch);
router.delete("/*", requireAuth, proxyDelete);

export default router;
