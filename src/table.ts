import fs from "node:fs";
import path from "node:path";

import { OracleBaseSchema, LocaleBaseSchema } from './schemas/bases.js';

export class Table<T extends OracleBaseSchema | LocaleBaseSchema> {
  public readonly list: ReadonlyArray<T>;
  public readonly dict: ReadonlyMap<string, T>;

  constructor(filename: string, index: "id" | "code" | "") {
    this.list = this.loadList(filename);
    this.dict = this.loadDict(index);
  }

  private loadList(filename: string): T[] {
    const result = new Array<T>();
    const stat = fs.lstatSync(filename);
    if(stat.isDirectory()) {
      const files = fs.readdirSync(filename);
      for(const f of files) {
        const subfolder = path.join(filename, f);
        const subordinates = this.loadList(subfolder);
        result.push(...subordinates);
      }
    } else if(stat.isFile()) {
      if(filename.endsWith(".json")) {
        const text = fs.readFileSync(filename, "utf8");
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

  private loadDict(index: "id" | "code" | ""): Map<string, T> {
    const result = new Map<string, T>();
    if(index) {
      const k = index as keyof T;
      for(const i of this.list) {
        result.set(i[k] as string, i);
      }
    }

    return result;
  }
}
