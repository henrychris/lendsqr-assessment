import { User } from "../models/user";
import { db } from "../db";

export async function IsEmailInUse(email: string): Promise<boolean> {
    const user = await db<User>("users").where("email", email).first();
    return user ? true : false;
}
