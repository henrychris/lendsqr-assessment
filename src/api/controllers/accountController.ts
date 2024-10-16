import { Request, Response } from "express";

import {
    fundAccountAsync,
    getUserByEmailAsync,
    getUserByIdAsync,
    transferFundsAsync,
} from "../../db/queries/user";

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

export const transferFunds = async (
    req: Request,
    res: Response
): Promise<void> => {
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
        const err = error as Error;
        console.error(err);
        res.status(400).json({ error: err.message });
    }
};
