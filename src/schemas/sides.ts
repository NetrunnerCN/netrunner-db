import { OracleBaseSchema, LocaleBaseSchema } from "./bases.js";

export interface OracleSideSchema extends OracleBaseSchema {
  readonly name: string;
}

export interface LocaleSideSchema extends LocaleBaseSchema {
  readonly name: string;
}
