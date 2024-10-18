import * as dotenv from "dotenv";
import path from "path";

interface DatabaseConfig {
    DB_HOST: string;
    DB_PORT: number;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_NAME: string;
}

interface AdjutorConfig {
    APP_KEY: string;
}

interface EnvironmentConfig {
    PORT: number;
    NODE_ENV: string;
    DATABASE: DatabaseConfig;
    ADJUTOR: AdjutorConfig;
}

function loadEnv(): EnvironmentConfig {
    const envPath = path.resolve(__dirname, "..", "..", ".env");
    dotenv.config({ path: envPath });

    const env: EnvironmentConfig = {
        PORT: Number(process.env.PORT),
        NODE_ENV: process.env.NODE_ENV || "",
        DATABASE: {
            DB_HOST: process.env.DB_HOST || "",
            DB_PORT: Number(process.env.DB_PORT),
            DB_USER: process.env.DB_USER || "",
            DB_PASSWORD: process.env.DB_PASSWORD || "",
            DB_NAME: process.env.DB_NAME || "",
        },
        ADJUTOR: {
            APP_KEY: process.env.APP_KEY || "",
        },
    };

    return env;
}

export const envService = {
    env: loadEnv(),
};
