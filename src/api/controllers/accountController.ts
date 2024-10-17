import { Request, Response } from "express";

import {
    fundAccountAsync,
    getUserByEmailAsync,
    getUserByIdAsync,
    transferFundsAsync,
    withdrawFundsAsync,
} from "../../db/queries/userQueries";

export async function fundAccount(req: Request, res: Response): Promise<void> {
    const { amount } = req.body;
    try {
        console.log(`userId: ${req.userId}. amount: ${amount}`);

        await fundAccountAsync(req.userId!, amount);
        res.status(200).json({ message: "Account funded" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Funding failed" });
    }
}

export async function transferFunds(
    req: Request,
    res: Response
): Promise<void> {
    const { recipientEmail, amount } = req.body;
    try {
        const sender = await getUserByIdAsync(req.userId!);
        if (!sender) {
            res.status(400).json({ error: "User not found." });
            return;
        }

        const recipient = await getUserByEmailAsync(recipientEmail);
        if (!recipient) {
            res.status(400).json({ error: "Recipient not found." });
            return;
        }

        if (sender.balance < amount) {
            res.status(400).json({ error: "Insufficient funds" });
            return;
        }

        await transferFundsAsync(sender.id, recipient.id, Number(amount));

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Transfer failed." });
    }
}

export async function withdrawFunds(req: Request, res: Response) {
    const { amount } = req.body;
    try {
        const user = await getUserByIdAsync(req.userId!);
        if (!user) {
            res.status(400).json({ error: "User not found." });
            return;
        }

        if (user.balance < amount) {
            res.status(400).json({ error: "Insufficient funds" });
            return;
        }

        await withdrawFundsAsync(user.id, amount);
        res.status(200).json({ message: "Withdrawal successful" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Withdrawal failed." });
    }
}
