import fs from "node:fs/promises";
import path from "node:path";
import log from "loglevel";

import { AppDataSource } from "./data-source.js";
import { OracleBaseSchema, LocaleBaseSchema } from "./schemas/bases.js";
import { OracleSideSchema, LocaleSideSchema } from "./schemas/sides.js";
import { BaseEntity } from "./entities/bases.js";
import { SideEntity } from "./entities/sides.js";

async function initialize(): Promise<void> {
    log.setLevel(log.levels.INFO);
    await AppDataSource.initialize();
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

        record.codename = oracle_item.id;
        record.oracle_name = oracle_item.name;
        const locale_item = locale_dict.get(oracle_item.id.replace("_", "-"));
        if(locale_item) {
            record.locale_name = locale_item.name;
        }

        await AppDataSource.manager.save(record);
        records.push(record);
    }

    await write_records(result_filename, records);
}

async function main(): Promise<void> {
    await initialize();
    await extract_sides();
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
