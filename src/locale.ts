import fs from 'node:fs/promises';
import log from "loglevel";
import { parse } from "csv-parse/sync";

import { AppDataSource } from "./data-source.js";
import { SideEntity, FactionEntity, TypeEntity, SubtypeEntity, SettypeEntity, CycleEntity } from './entities.js';


/** 本地化数据通用字段 */
interface BaseSchema {
    /** 唯一标识符 */
    readonly id: string;
}

/** 本地化数据「阵营」 */
interface SideSchema extends BaseSchema {
    /** 阵营名称 */
    readonly name: string;
}

/** 本地化数据「派系」 */
interface FactionSchema extends BaseSchema {
    /** 派系名称 */
    readonly name: string;
    /** 派系描述 */
    readonly description: string;
}

/** 本地化数据「类型」 */
interface TypeSchema extends BaseSchema {
    /** 类型名称 */
    readonly name: string;
}

/** 本地化数据「子类型」 */
interface SubtypeSchema extends BaseSchema {
    /** 子类型名称 */
    readonly name: string;
}

/** 本地化数据「卡包类型」 */
interface SettypeSchema extends BaseSchema {
    /** 卡包类型名称 */
    readonly name: string;
    /** 卡包类型描述 */
    readonly description: string;
}

/** 本地化数据「循环」 */
interface CycleSchema extends BaseSchema {
    /** 循环名称 */
    readonly name: string;
}


async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
    log.info("Database connected!");
}

async function terminate(): Promise<void> {
    await AppDataSource.destroy();
}

async function load_schemas<T extends BaseSchema>(filename: string): Promise<Array<T>> {
    const text = await fs.readFile(filename, "utf8");
    return parse(text, {
        columns: true,
        skip_empty_lines: true,
    });
}

async function extract_sides(): Promise<void> {
    const schemas = await load_schemas<SideSchema>("data/Locale/data/sides.csv");
    const database = AppDataSource.getRepository(SideEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'sides' finished!");
}

async function extract_factions(): Promise<void> {
    const schemas = await load_schemas<FactionSchema>("data/Locale/data/factions.csv");
    const database = AppDataSource.getRepository(FactionEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        record.locale_desc = schema.description ?? "";
        await database.save(record);
    }

    log.info("Save 'factions' finished!");
}

async function extract_types(): Promise<void> {
    const schemas = await load_schemas<TypeSchema>("data/Locale/data/types.csv");
    const database = AppDataSource.getRepository(TypeEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'types' finished!");
}

async function extract_subtypes(): Promise<void> {
    const schemas = await load_schemas<SubtypeSchema>("data/Locale/data/subtypes.csv");
    const database = AppDataSource.getRepository(SubtypeEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'subtypes' finished!");
}

async function extract_settypes(): Promise<void> {
    const schemas = await load_schemas<SettypeSchema>("data/Locale/data/set_types.csv");
    const database = AppDataSource.getRepository(SettypeEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        record.locale_desc = schema.description ?? "";
        await database.save(record);
    }

    log.info("Save 'settypes' finished!");
}

async function extract_cycles(): Promise<void> {
    const schemas = await load_schemas<CycleSchema>("data/Locale/data/cycles.csv");
    const database = AppDataSource.getRepository(CycleEntity);
    for(const schema of schemas) {
        const record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            continue;
        }

        record.locale_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'cycles' finished!");
}

async function main(): Promise<void> {
    await initialize();
    await extract_sides();
    await extract_factions();
    await extract_types();
    await extract_subtypes();
    await extract_settypes();
    await extract_cycles();
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
