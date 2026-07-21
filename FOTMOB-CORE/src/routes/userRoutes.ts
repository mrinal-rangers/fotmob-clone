import { Router } from "express";
import { requireApiKey } from "../middleware/apiKeyAuth";
import {
  syncUser,
  getUser,
  getUserByClerkId,
  updatePreferences,
  getFollows,
  getFollowsByType,
  followEntity,
  unfollowEntity,
} from "../controllers/UserController";

const router = Router();

router.use(requireApiKey);

router.post("/sync", syncUser);
router.get("/:id", getUser);
router.get("/clerk/:clerkId", getUserByClerkId);
router.patch("/:id/preferences", updatePreferences);
router.get("/:id/follows", getFollows);
router.get("/:id/follows/:entityType", getFollowsByType);
router.post("/:id/follows", followEntity);
router.delete("/:id/follows/:followId", unfollowEntity);

export default router;
