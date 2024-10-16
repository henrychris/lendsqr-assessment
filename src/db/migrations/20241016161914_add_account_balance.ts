import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.alterTable("users", (table) => {
        table.decimal("balance", 12, 2).defaultTo(0.0);
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.table("users", (table) => {
        table.dropColumn("balance");
    });
}
