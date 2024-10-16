import express from "express";
import { fundAccount } from "../controllers/accountController";
import { extractUserIdFromToken } from "../middleware/tokenMiddleware";

const router = express.Router();

router.post("/fund", extractUserIdFromToken, fundAccount);

export default router;
