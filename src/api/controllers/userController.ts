import { Request, Response } from "express";
import bcrypt, { compare } from "bcrypt";
import { db } from "../../db/db";
import { generateToken } from "../../helpers/token";
import { getUserByEmailAsync, IsEmailInUse } from "../../db/queries/user";

export async function createAccount(req: Request, res: Response) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    // todo: replace with joi validation

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
        res.status(400).json({
            error: "Something went wrong. Please try again later",
        });
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: "All fields are required." });
    }
    // todo: replace with joi validation

    try {
        const user = await getUserByEmailAsync(email);
        if (!user) {
            console.error(
                "login failed. no user found with the provided email address."
            );
            res.status(400).json({ error: "Email or password incorrect." });
            return;
        }

        let isPasswordValid = await compare(password, user.password);
        if (!isPasswordValid) {
            console.error(
                `login failed. invalid password. user id: ${user.id}`
            );
            res.status(400).json({ error: "Email or password incorrect." });
            return;
        }

        res.status(200).json({
            userId: user.id,
            token: generateToken(user.id),
        });
    } catch (error) {
        res.status(400).json({
            error: "Something went wrong. Please try again later",
        });
    }
}
