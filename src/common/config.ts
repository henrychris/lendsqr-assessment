import * as dotenv from "dotenv";
dotenv.config();

function assertIsDefined<T>(
    value: T | undefined | null,
    name: string
): asserts value is T {
    if (value === undefined || value === null) {
        throw new Error(`Environment variable ${name} is not defined`);
    }
}

// Validate all environment variables upfront
const envVars = [
    "PORT",
    "DB_PORT",
    "DB_HOST",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
    "APP_ID",
    "APP_KEY",
];

for (const name of envVars) {
    assertIsDefined(process.env[name], name);
}

// Safely parse numeric values and validate
export const PORT: number = parseInt(process.env.PORT!, 10);
if (isNaN(PORT)) {
    throw new Error("PORT must be a valid number");
}

export const DB_PORT: number = parseInt(process.env.DB_PORT!, 10);
if (isNaN(DB_PORT)) {
    throw new Error("DB_PORT must be a valid number");
}

export const DB_HOST: string = process.env.DB_HOST!;
export const DB_USER: string = process.env.DB_USER!;
export const DB_PASSWORD: string = process.env.DB_PASSWORD!;
export const DB_NAME: string = process.env.DB_NAME!;
export const APP_ID: string = process.env.APP_ID!;
export const APP_KEY: string = process.env.APP_KEY!;
