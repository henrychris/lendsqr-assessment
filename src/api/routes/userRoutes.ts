import express from "express";
import { createAccount, login } from "../controllers/userController";

const router = express.Router();

router.post("/create", createAccount);
router.post("/login", login);

export default router;
