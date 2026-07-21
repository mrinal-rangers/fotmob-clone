import { Router } from "express";
import { validate } from "../middleware/validation";
import { GoogleSignInSchema } from "../types";
import { requireAuth } from "../middleware/auth";
import { requireClerkAuth } from "../middleware/clerkAuth";
import { googleSignIn } from "../controllers/AuthController";
import { proxyGet, proxyPost, proxyPatch, proxyDelete } from "../controllers/ProxyController";
import { getMe, updatePreferences, getFollows, followEntity, unfollowEntity } from "../controllers/UserController";

const router = Router();

router.get("/health", (_req, res) => res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() }));

router.post("/auth/google", validate(GoogleSignInSchema), googleSignIn);

router.post("/auth/clerk", requireClerkAuth, (req: any, res: any) => res.json(req.user));

router.get("/users/me", requireClerkAuth, getMe);
router.patch("/users/me/preferences", requireClerkAuth, updatePreferences);
router.get("/users/me/follows", requireClerkAuth, getFollows);
router.post("/users/me/follows", requireClerkAuth, followEntity);
router.delete("/users/me/follows/:followId", requireClerkAuth, unfollowEntity);

router.use(requireAuth);

router.get("/*", proxyGet);
router.post("/*", proxyPost);
router.patch("/*", proxyPatch);
router.delete("/*", proxyDelete);

export default router;
