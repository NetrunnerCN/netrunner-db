import fs from "node:fs/promises";
import path from "node:path";
import log from "loglevel";

import { AppDataSource } from "./data-source.js";
import {
    OracleBaseSchema, LocaleBaseSchema,
    OracleSideSchema, LocaleSideSchema,
    OracleFactionSchema, LocaleFactionSchema,
    OracleTypeSchema, LocaleTypeSchema,
} from "./schemas.js";
import {
    BaseEntity,
    FactionEntity,
    SideEntity,
    TypeEntity,
} from "./entities.js";

async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
    log.info("Database connected!");
}

async function terminate(): Promise<void> {
    await AppDataSource.destroy();
}

async function load_schemas<T extends OracleBaseSchema | LocaleBaseSchema>(filename: string): Promise<Array<T>> {
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

async function load_oracle_schemas<T extends OracleBaseSchema>(filename: string): Promise<Array<T>> {
    return load_schemas<T>(filename);
}

async function load_locale_schemas<T extends LocaleBaseSchema>(filename: string): Promise<Map<string, T>> {
    const items = await load_schemas<T>(filename);
    const result = new Map<string, T>();
    for(const item of items) {
        result.set(item.code, item);
    }

    return result;
}

async function write_records<T extends BaseEntity>(filename: string, data: T[]): Promise<void> {
    const lines = new Array<string>();
    for(const item of data) {
        const text = JSON.stringify(item, (k, v) => {
            return (k.length > 0 && typeof v !== "string") ? undefined : v;
        }, 2);
        lines.push(text);
    }

    const result = "[\n" + lines.join(",\n") + "\n]";
    await fs.writeFile(filename, result, "utf8");
}

async function extract_sides(): Promise<void> {
    const oracle_filename = "data/enUS/v2/sides.json";
    const locale_filename = "data/zhCN/json/translations/zh-hans/sides.zh-hans.json";
    const result_filename = "result/sides.json";
    const oracle_list = await load_oracle_schemas<OracleSideSchema>(oracle_filename);
    const locale_dict = await load_locale_schemas<LocaleSideSchema>(locale_filename);
    const records = new Array<SideEntity>();
    const database = AppDataSource.getRepository(SideEntity);
    for(const oracle_item of oracle_list) {
        let record = await database.findOneBy({ codename: oracle_item.id });
        if(!record) {
            record = new SideEntity();
        }

        record.codename = oracle_item.id ?? "";
        record.oracle_name = oracle_item.name ?? "";
        const locale_item = locale_dict.get(oracle_item.id.replace("_", "-"));
        if(locale_item) {
            record.locale_name = locale_item.name ?? "";
        }

        await database.save(record);
        records.push(record);
    }

    await write_records(result_filename, records);
    log.info("Save 'sides' finished!");
}

async function extract_factions(): Promise<Promise<void>> {
    const oracle_filename = "data/enUS/v2/factions.json";
    const locale_filename = "data/zhCN/json/translations/zh-hans/factions.zh-hans.json";
    const result_filename = "result/factions.json";
    const oracle_list = await load_oracle_schemas<OracleFactionSchema>(oracle_filename);
    const locale_dict = await load_locale_schemas<LocaleFactionSchema>(locale_filename);
    const records = new Array<FactionEntity>();
    const database = AppDataSource.getRepository(FactionEntity);
    for(const oracle_item of oracle_list) {
        let record = await database.findOneBy({ codename: oracle_item.id });
        if(!record) {
            record = new FactionEntity();
        }

        record.codename = oracle_item.id ?? "";
        record.oracle_name = oracle_item.name ?? "";
        record.oracle_desc = oracle_item.description ?? "";
        record.color = oracle_item.color ?? "";
        record.is_mini = oracle_item.is_mini === undefined ? "" : oracle_item.is_mini.toString();
        record.side_codename = oracle_item.side_id ?? "";
        const side_entity = await AppDataSource.manager.findOneBy(SideEntity, { codename: record.side_codename });
        if(side_entity) {
            record.side = side_entity;
        }

        const locale_item = locale_dict.get(oracle_item.id.replace("_", "-"));
        if(locale_item) {
            record.locale_name = locale_item.name ?? "";
            record.locale_desc = locale_item.description ?? "";
        }

        await database.save(record);
        records.push(record);
    }

    await write_records(result_filename, records);
    log.info("Save 'factions' finished!");
}

async function extract_types(): Promise<Promise<void>> {
    const oracle_filename = "data/enUS/v2/card_types.json";
    const locale_filename = "data/zhCN/json/translations/zh-hans/types.zh-hans.json";
    const result_filename = "result/types.json";
    const oracle_list = await load_oracle_schemas<OracleTypeSchema>(oracle_filename);
    const locale_dict = await load_locale_schemas<LocaleTypeSchema>(locale_filename);
    const records = new Array<TypeEntity>();
    const database = AppDataSource.getRepository(TypeEntity);
    for(const oracle_item of oracle_list) {
        let record = await database.findOneBy({ codename: oracle_item.id });
        if(!record) {
            record = new TypeEntity();
        }

        record.codename = oracle_item.id ?? "";
        record.oracle_name = oracle_item.name ?? "";
        record.side_codename = oracle_item.side_id ?? "";
        const side_entity = await AppDataSource.manager.findOneBy(SideEntity, { codename: record.side_codename });
        if(side_entity) {
            record.side = side_entity;
        }

        const locale_item = locale_dict.get(oracle_item.id.replace("_", "-"));
        if(locale_item) {
            record.locale_name = locale_item.name ?? "";
        }

        await database.save(record);
        records.push(record);
    }

    await write_records(result_filename, records);
    log.info("Save 'types' finished!");
}

async function main(): Promise<void> {
    await initialize();
    await extract_sides();
    await extract_factions();
    await extract_types();
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
