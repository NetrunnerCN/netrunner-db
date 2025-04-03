import connection from "./connection.json" with { type: "json" };
import { DataSource } from "typeorm";
import { SideEntity, FactionEntity } from "./entities.js";

export const AppDataSource = new DataSource({
    ...connection,
    type: "mysql",
    logging: ["error", "warn", "info", "log", "migration"],
    entities: [SideEntity, FactionEntity],
    migrations: ["./migrations/*.ts"],
});
