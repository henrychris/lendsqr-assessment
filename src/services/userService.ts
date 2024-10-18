import { User } from "../db/models/user";
import { db } from "../db/db";

/**
 * Checks if the given email address is already in use.
 *
 * @param email An email address
 * @returns A boolean indicating if the email is in use or not
 */
export async function isEmailInUseAsync(email: string): Promise<boolean> {
    const user = await db<User>("users").where("email", email).first();
    return user ? true : false;
}

/**
 * Retrieves a user by their email address.
 *
 * @param email An email address
 *
 * @returns A user object or undefined, if no user was found.
 */
export async function getUserByEmailAsync(
    email: string
): Promise<User | undefined> {
    return await db<User>("users").where("email", email).first();
}

/**
 * Retrieves a user by their id.
 *
 * @param id The user's unique identifier
 *
 * @returns A user object or undefined, if no user was found.
 */
export async function getUserByIdAsync(id: number): Promise<User | undefined> {
    const user = await db<User>("users").where("id", id).first();
    return user;
}

/**
 * Insert a user entity into the database
 *
 * @param name The user's name
 * @param email The user's email address
 * @param passwordHash The hashed password
 * @returns The created user's id
 */
export async function createUserAsync(
    name: string,
    email: string,
    passwordHash: string
): Promise<number> {
    const [id] = await db("users").insert({
        name,
        email,
        password: passwordHash,
    });
    return id;
}
