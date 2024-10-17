import { Request, Response } from "express";
import bcrypt, { compare } from "bcrypt";
import { db } from "../../db/db";
import { generateToken } from "../../helpers/token";
import { getUserByEmailAsync, isEmailInUse } from "../../services/userService";

export async function createAccount(
    req: Request,
    res: Response
): Promise<void> {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }
    // todo: replace with joi validation

    try {
        const isEmailUsed = await isEmailInUse(email);
        if (isEmailUsed) {
            res.status(400).json({ error: "This email address is taken." });
            return;
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
        console.error("Error creating account:", error);
        res.status(500).json({
            error: "Something went wrong. Please try again later",
        });
    }
}

export async function login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ error: "All fields are required." });
        return;
    }
    // todo: replace with joi validation

    try {
        const user = await getUserByEmailAsync(email);
        if (!user) {
            console.error(
                "login failed. no user found with the provided email address."
            );
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        let isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            console.error(
                `login failed. invalid password. user id: ${user.id}`
            );
            res.status(401).json({ error: "Invalid credentials." });
            return;
        }

        res.status(200).json({
            userId: user.id,
            balance: Number(user.balance),
            token: generateToken(user.id),
        });
    } catch (error) {
        console.error("Error creating account:", error);
        res.status(500).json({
            error: "Something went wrong. Please try again later",
        });
    }
}
