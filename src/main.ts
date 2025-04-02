import fs from "node:fs/promises";
import path from "node:path";
import log from "loglevel";
import { DataSource } from "typeorm";

import connection from "./connection.json" with { type: "json" };
import { OracleBaseSchema, LocaleBaseSchema } from "./schemas/bases.js";
import { OracleSideSchema, LocaleSideSchema } from "./schemas/sides.js";
import { BaseEntity } from "./entities/bases.js";
import { SideEntity } from "./entities/sides.js";
import { Transaction } from "./transaction.js";
import { Table } from "./table.js";

const RESULT_FOLDER = "result";
const TRANSACTION_FOLDER = "transaction";
const JSON_EXTENSION = ".json";

async function initialize(): Promise<DataSource> {
  log.setLevel(log.levels.INFO);
  const source = new DataSource({
    ...connection,
    type: "mysql",
    logging: "all",
    entities: [SideEntity],
    dropSchema: true,
    synchronize: true,
  });
  await source.initialize();
  return source;
}

async function loadTransaction(name: string): Promise<Transaction> {
  const address = path.join(TRANSACTION_FOLDER, name + JSON_EXTENSION);
  const content = await fs.readFile(address, "utf8");
  return JSON.parse(content);
}

async function saveRecord<T extends BaseEntity>(name: string, data: T[]): Promise<void> {
  const address = path.join(RESULT_FOLDER, name + JSON_EXTENSION);
  const content = JSON.stringify(data, (k, v) => {
    return k === "id" ? undefined : v;
  }, 2);
  await fs.writeFile(address, content, "utf8");
}

async function extract<
  TO extends OracleBaseSchema,
  TL extends LocaleBaseSchema,
  TE extends BaseEntity
>(database: DataSource, name: string, constructor: new() => TE): Promise<void> {
  const records = new Array<TE>();
  const transaction = await loadTransaction(name);
  const oracle = new Table<TO>(transaction.oracle_file, transaction.oracle_id);
  const locale = new Table<TL>(transaction.locale_file, transaction.locale_id);
  for(const item of oracle.list) {
    const record = new constructor();
    for(const f of transaction.oracle_fields) {
      const idx_src = f.source as keyof TO;
      const idx_dst = f.field as keyof TE;
      record[idx_dst] = item[idx_src] as unknown as TE[keyof TE];
    }

    const idx_link = transaction.link_id as keyof TO;
    const link_identifier = item[idx_link] as string;
    const locale_item = locale.dict.get(link_identifier.replace("_", "-"));
    if(locale_item) {
      for(const f of transaction.locale_fields) {
        const idx_src = f.source as keyof TL;
        const idx_dst = f.field as keyof TE;
        record[idx_dst] = locale_item[idx_src] as unknown as TE[keyof TE];
      }
    }

    await database.manager.save(record);
    records.push(record);
  }

  await saveRecord(name, records);
  log.info(`Record "${name}" saved.`);
}

async function main(): Promise<void> {
  const database = await initialize();
  await extract<OracleSideSchema, LocaleSideSchema, SideEntity>(database, "sides", SideEntity);
  await database.destroy();
  log.info("Disconnected!");
}

main()
  .then(() => {
    log.info("Finished!");
  })
  .catch((err: Error) => {
    log.error("Failed with error: " + err.message);
    log.error("Stacktrace: " + err.stack);
  });
