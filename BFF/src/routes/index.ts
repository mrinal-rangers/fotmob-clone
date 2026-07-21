import { Router } from "express";
import { validate } from "../middleware/validation";
import { GoogleSignInSchema } from "../types";
import { requireAuth } from "../middleware/auth";
import { googleSignIn } from "../controllers/AuthController";
import { proxyGet, proxyPost, proxyPatch, proxyDelete } from "../controllers/ProxyController";

const router = Router();

router.post("/auth/google", validate(GoogleSignInSchema), googleSignIn);

router.get("/health", (_req, res) => res.json({ status: "ok", service: "bff", timestamp: new Date().toISOString() }));

router.use(requireAuth);

router.get("/*", proxyGet);
router.post("/*", proxyPost);
router.patch("/*", proxyPatch);
router.delete("/*", proxyDelete);

export default router;
