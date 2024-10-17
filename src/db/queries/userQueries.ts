import { User } from "../models/user";
import { db } from "../db";

export async function IsEmailInUse(email: string): Promise<boolean> {
    const user = await db<User>("users").where("email", email).first();
    return user ? true : false;
}

export async function getUserByEmailAsync(
    email: string
): Promise<User | undefined> {
    const user = await db<User>("users").where("email", email).first();
    return user;
}

export async function getUserByIdAsync(id: number): Promise<User | undefined> {
    const user = await db<User>("users").where("id", id).first();
    return user;
}

export async function fundAccountAsync(userId: number, amount: number) {
    await db<User>("users").where({ id: userId }).increment("balance", amount);
}

export async function transferFundsAsync(
    senderId: number,
    recipientId: number,
    amount: number
) {
    await db.transaction(async (trx) => {
        await trx("users").where({ id: senderId }).decrement("balance", amount);
        await trx("users")
            .where({ id: recipientId })
            .increment("balance", amount);
    });
}

export async function withdrawFundsAsync(userId: number, amount: number) {
    await db("users").where({ id: userId }).decrement("balance", amount);
}
