import { Request, Response } from "express";

import { fundAccountAsync } from "../../db/queries/user";

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
