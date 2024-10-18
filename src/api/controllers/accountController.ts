import { Request, Response } from "express";
import {
    fundAccountAsync,
    transferFundsAsync,
    withdrawFundsAsync,
} from "../../services/accountService";
import {
    getUserByEmailAsync,
    getUserByIdAsync,
} from "../../services/userService";

export async function fundAccount(req: Request, res: Response): Promise<void> {
    const { amount } = req.body;
    try {
        const sender = await getUserByIdAsync(req.userId!);
        if (!sender) {
            res.status(404).json({ error: "User not found." });
            return;
        }

        await fundAccountAsync(req.userId!, amount);
        console.log(`Successfully funded user ${req.userId} with ${amount}.`);
        res.status(200).json({ message: "Account funded" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Funding failed" });
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

        if (sender.email === recipient.email) {
            res.status(400).json({
                error: "Invalid Recipient - you may not transfer funds to yourself.",
            });
            return;
        }

        if (sender.balance < amount) {
            res.status(400).json({ error: "Insufficient funds" });
            return;
        }

        await transferFundsAsync(sender.id, recipient.id, Number(amount));
        console.log(
            `Transferred ${amount} from user ${sender.id} to user ${recipient.id}.`
        );

        res.status(200).json({ message: "Transfer successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Transfer failed." });
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
        console.log(`Successfully withdrew ${amount} from user ${req.userId}.`);
        res.status(200).json({ message: "Withdrawal successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Withdrawal failed." });
    }
}
