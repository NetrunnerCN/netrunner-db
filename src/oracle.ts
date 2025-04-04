import fs from "node:fs/promises";
import path from "node:path";
import log from "loglevel";

import { AppDataSource } from "./data-source.js";
import {
    SideEntity, FactionEntity, TypeEntity, SubtypeEntity,
    SettypeEntity, CycleEntity,
} from './entities.js';


/** 英文源数据通用字段 */
interface BaseSchema {
    /** 唯一标识符 */
    readonly id: string;
}

/** 英文源数据「阵营」 */
interface SideSchema extends BaseSchema {
    /** 阵营名称 */
    readonly name: string;
}

/** 英文源数据「派系」 */
interface FactionSchema extends BaseSchema {
    /** 派系名称 */
    readonly name: string;
    /** 派系描述 */
    readonly description: string;
    /** 派系颜色 */
    readonly color: string;
    /** 派系所属阵营ID */
    readonly side_id: string;
    /** 派系是否为迷你派系 */
    readonly is_mini: boolean;
}

/** 英文源数据「类型」 */
interface TypeSchema extends BaseSchema {
    /** 类型名称 */
    readonly name: string;
    /** 类型所属阵营ID */
    readonly side_id: string;
}

/** 英文源数据「子类型」 */
interface SubtypeSchema extends BaseSchema {
    /** 子类型名称 */
    readonly name: string;
}

/** 英文源数据「卡包类型」 */
interface SettypeSchema extends BaseSchema {
    /** 卡包类型名称 */
    readonly name: string;
    /** 卡包类型描述 */
    readonly description: string;
}

/** 英文源数据「循环」 */
interface CycleSchema extends BaseSchema {
    /** 循环名称 */
    readonly name: string;
    /** 循环旧版唯一标识符 */
    readonly legacy_code: string;
    /** 循环序号 */
    readonly position: number;
    /** 循环发行组 */
    readonly released_by: string;
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
    const result = new Array<T>();
    const stat = await fs.lstat(filename);
    if(stat.isDirectory()) {
        const files = await fs.readdir(filename);
        for(const f of files) {
            const subfolder = path.join(filename, f);
            const subordinates = await load_schemas<T>(subfolder);
            result.push(...subordinates);
        }
    } else if(stat.isFile()) {
        if(filename.endsWith(".json")) {
            const text = await fs.readFile(filename, "utf8");
            const content = JSON.parse(text);
            if(Array.isArray(content)) {
                const items = content as T[];
                for(const i of items) {
                    result.push(i);
                }
            } else {
                result.push(content as T);
            }
        }
    }

    return result;
}

async function extract_sides(): Promise<void> {
    const schemas = await load_schemas<SideSchema>("data/Oracle/v2/sides.json");
    const database = AppDataSource.getRepository(SideEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new SideEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'sides' finished!");
}

async function extract_factions(): Promise<void> {
    const schemas = await load_schemas<FactionSchema>("data/Oracle/v2/factions.json");
    const database = AppDataSource.getRepository(FactionEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new FactionEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        record.oracle_desc = schema.description ?? "";
        record.color = schema.color ?? "";
        record.is_mini = schema.is_mini;
        record.side_codename = schema.side_id ?? "";
        const side_entity = await AppDataSource.manager.findOneBy(SideEntity, { codename: record.side_codename });
        if(side_entity) {
            record.side = side_entity;
        }

        await database.save(record);
    }

    log.info("Save 'factions' finished!");
}

async function extract_types(): Promise<void> {
    const schemas = await load_schemas<TypeSchema>("data/Oracle/v2/card_types.json");
    const database = AppDataSource.getRepository(TypeEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new TypeEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        record.side_codename = schema.side_id ?? "";
        const side_entity = await AppDataSource.manager.findOneBy(SideEntity, { codename: record.side_codename });
        if(side_entity) {
            record.side = side_entity;
        }

        await database.save(record);
    }

    log.info("Save 'types' finished!");
}

async function extract_subtypes(): Promise<void> {
    const schemas = await load_schemas<SubtypeSchema>("data/Oracle/v2/card_subtypes.json");
    const database = AppDataSource.getRepository(SubtypeEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new SubtypeEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        await database.save(record);
    }

    log.info("Save 'subtypes' finished!");
}

async function extract_settypes(): Promise<void> {
    const schemas = await load_schemas<SettypeSchema>("data/Oracle/v2/card_set_types.json");
    const database = AppDataSource.getRepository(SettypeEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new SettypeEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        record.oracle_desc = schema.description ?? "";
        await database.save(record);
    }

    log.info("Save 'settypes' finished!");
}

async function extract_cycles(): Promise<void> {
    const schemas = await load_schemas<CycleSchema>("data/Oracle/v2/card_cycles.json");
    const database = AppDataSource.getRepository(CycleEntity);
    for(const schema of schemas) {
        let record = await database.findOneBy({ codename: schema.id });
        if(!record) {
            record = new CycleEntity();
        }

        record.codename = schema.id ?? "";
        record.oracle_name = schema.name ?? "";
        record.position = schema.position ?? 0;
        record.released_by = schema.released_by ?? "";
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
