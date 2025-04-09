import fs from 'node:fs/promises';
import log from "loglevel";

import { AppDataSource } from "./data-source.js";
import {
    SPLITTER,
    BaseEntity, SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
    SettypeEntity, CycleEntity, SetEntity,
    FormatEntity, PoolEntity, RestrictionEntity, SnapshotEntity,
    CardEntity, PrintingEntity, RulingEntity,
} from './entities.js';
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
        if(k === "id") {
            return undefined;
        }

        if(k.endsWith("list")) {
            return (v && v.length > 0 ) ? v.split(SPLITTER) : [];
        }

        return v;
    }, 2);
    await fs.writeFile(filename, content, "utf8");
    log.info(`Save '${filename}' finished!`);
}

async function main(): Promise<void> {
    await initialize();
    await extract(SideEntity, "result/sides.json");
    await extract(FactionEntity, "result/factions.json");
    await extract(TypeEntity, "result/types.json");
    await extract(SubtypeEntity, "result/subtypes.json");
    await extract(SettypeEntity, "result/settypes.json");
    await extract(CycleEntity, "result/cycles.json");
    await extract(SetEntity, "result/sets.json");
    await extract(FormatEntity, "result/formats.json");
    await extract(PoolEntity, "result/pools.json");
    await extract(RestrictionEntity, "result/restrictions.json");
    await extract(SnapshotEntity, "result/snapshots.json");
    await extract(CardEntity, "result/cards.json");
    await extract(PrintingEntity, "result/printings.json");
    await extract(RulingEntity, "result/rulings.json");
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
