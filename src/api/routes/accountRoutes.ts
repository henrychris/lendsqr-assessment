import express from "express";
import { fundAccount, transferFunds, withdrawFunds } from "../controllers/accountController";
import { extractUserIdFromToken } from "../middleware/tokenMiddleware";

const router = express.Router();

router.post("/fund", extractUserIdFromToken, fundAccount);
router.post("/transfer", extractUserIdFromToken, transferFunds);
router.post("/withdraw", extractUserIdFromToken, withdrawFunds);

export default router;
