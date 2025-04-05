import fs from 'node:fs/promises';
import log from "loglevel";

import { AppDataSource } from "./data-source.js";
import { SideEntity, FactionEntity, BaseEntity } from "./entities.js";
import { EntityTarget } from "typeorm";


async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
    log.info("Database connected!");
}

async function terminate(): Promise<void> {
    await AppDataSource.destroy();
}

async function extract<T extends BaseEntity>(type: EntityTarget<T>, filename: string): Promise<void> {
    const database = AppDataSource.getRepository(type);
    const items = await database.find();
    const content = JSON.stringify(items, (k, v) => {
        return k === "id" ? undefined : v;
    }, 2);
    await fs.writeFile(filename, content, "utf8");
    log.info(`Save '${filename}' finished!`);
}

async function main(): Promise<void> {
    await initialize();
    await extract(SideEntity, "result/sides.json");
    await extract(FactionEntity, "result/factions.json");
    await terminate();
}

main()
    .then(() => {
        log.info("Finished!");
    })
    .catch((err: Error) => {
        log.error("Failed with error: " + err.message);
        log.error("Stacktrace: " + err.stack);
    });
