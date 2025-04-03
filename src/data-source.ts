import connection from "./connection.json" with { type: "json" };
import { DataSource } from "typeorm";
import { SideEntity } from "./entities/sides.js";

export const AppDataSource = new DataSource({
    ...connection,
    type: "mysql",
    logging: "all",
    entities: [SideEntity],
    migrations: ["./migrations/*.ts"],
});
