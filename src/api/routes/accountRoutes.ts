import express from "express";
import {
    fundAccount,
    transferFunds,
    withdrawFunds,
} from "../controllers/accountController";
import { extractUserIdFromToken } from "../middleware/tokenMiddleware";
import { validateRequest } from "../middleware/joiMiddleware";
import {
    fundAccountSchema,
    transferFundsSchema,
    withdrawFundsSchema,
} from "../../validation/accountValidation";

const router = express.Router();

router.post(
    "/fund",
    validateRequest(fundAccountSchema),
    extractUserIdFromToken,
    fundAccount
);
router.post(
    "/transfer",
    validateRequest(transferFundsSchema),
    extractUserIdFromToken,
    transferFunds
);
router.post(
    "/withdraw",
    validateRequest(withdrawFundsSchema),
    extractUserIdFromToken,
    withdrawFunds
);

export default router;
