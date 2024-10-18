import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { generateToken } from "../../helpers/token";
import {
    createUserAsync,
    getUserByEmailAsync,
    isEmailInUseAsync as isEmailInUseAsync,
} from "../../services/userService";
import { isUserBlacklisted } from "../../services/adjutorService";

export async function createAccount(
    req: Request,
    res: Response
): Promise<void> {
    const { name, email, password } = req.body;

    try {
        const isBlacklisted = await isUserBlacklisted(email);
        if (isBlacklisted) {
            res.status(403).json({ error: "User is blacklisted" });
            return;
        }

        const isEmailInUse = await isEmailInUseAsync(email);
        if (isEmailInUse) {
            res.status(400).json({ error: "This email address is taken." });
            return;
        }

        const hashedPassword = await hash(password, 10);
        const id = await createUserAsync(name, email, hashedPassword);

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
            name: user.name,
            email: user.email,
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
