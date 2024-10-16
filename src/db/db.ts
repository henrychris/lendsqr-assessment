import { knex, type Knex } from "knex";
import * as dotenv from "dotenv";
dotenv.config({
    path: "../../.env", // point to main env file
});

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "3306", 10),
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: "knex_migrations",
        directory: "./migrations",
    },
};

export const db = knex(config);

export async function testDbConnection(): Promise<void> {
    try {
        await db.raw("SELECT 1");
        console.log("✅ Database connected successfully");
    } catch (error) {
        const err = error as Error;
        console.error("❌ Failed to connect to the database:", err.message);
        process.exit(1);
    }
}

export default config;
