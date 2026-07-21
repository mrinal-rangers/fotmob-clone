import { Router } from "express";
import { listTransfers } from "../controllers/TransferController";

const router = Router();

router.get("/", listTransfers);

export default router;
