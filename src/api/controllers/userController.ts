import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { db } from "../../db/db";
import { generateToken } from "../../helpers/token";
import { IsEmailInUse } from "../../db/queries/user";

export const createAccount = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    try {
        const isEmailInUse = await IsEmailInUse(email);
        if (isEmailInUse) {
            res.status(400).json({ error: "This email address is taken." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const [id] = await db("users").insert({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "Account created",
            userId: id,
            token: generateToken(id),
        });
    } catch (error) {
        res.status(400).json({ error: "Account creation failed" });
    }
};
