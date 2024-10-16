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

export async function fundAccountAsync(userId: number, amount: number) {
    await db<User>("users").where({ id: userId }).increment("balance", amount);
}
