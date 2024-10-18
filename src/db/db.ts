import { knex, type Knex } from "knex";
import { envService } from "../common/config";
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } =
    envService.env.DATABASE;

const config: Knex.Config = {
    client: "mysql2",
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_NAME,
        port: DB_PORT,
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
