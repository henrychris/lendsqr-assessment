import express from "express";
import { fundAccount, transferFunds } from "../controllers/accountController";
import { extractUserIdFromToken } from "../middleware/tokenMiddleware";

const router = express.Router();

router.post("/fund", extractUserIdFromToken, fundAccount);
router.post("/transfer", extractUserIdFromToken, transferFunds);

export default router;
