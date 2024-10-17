import express from "express";
import { createAccount, login } from "../controllers/userController";
import { validateRequest } from "../middleware/joiMiddleware";
import {
    createAccountSchema,
    loginSchema,
} from "../../validation/userValidation";

const router = express.Router();

router.post("/create", validateRequest(createAccountSchema), createAccount);
router.post("/login", validateRequest(loginSchema), login);

export default router;
