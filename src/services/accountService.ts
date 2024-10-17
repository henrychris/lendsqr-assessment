import { User } from "../db/models/user";
import { db } from "../db/db";

/**
 * Funds the user's account by a given amount.
 *
 * @param userId The user's unique identifier
 *
 * @param amount The amount to add to their account.
 */
export async function fundAccountAsync(
    userId: number,
    amount: number
): Promise<void> {
    if (amount <= 0) throw new Error("Amount must be positive.");

    await db<User>("users").where({ id: userId }).increment("balance", amount);
}

/**
 * Transfers funds between two users.
 *
 * @param senderId The user to deduct funds from
 *
 * @param recipientId The user to send funds to
 *
 * @param amount The amount involved
 */
export async function transferFundsAsync(
    senderId: number,
    recipientId: number,
    amount: number
): Promise<void> {
    await db.transaction(async (trx) => {
        await trx("users").where({ id: senderId }).decrement("balance", amount);
        await trx("users")
            .where({ id: recipientId })
            .increment("balance", amount);
    });
}

/**
 * Withdraws a given amount from the user's account.
 * @param userId The user's unique identifier
 *
 * @param amount The amount to withdraw
 */
export async function withdrawFundsAsync(
    userId: number,
    amount: number
): Promise<void> {
    await db("users").where({ id: userId }).decrement("balance", amount);
}
