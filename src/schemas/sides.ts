import { OracleBaseSchema, LocaleBaseSchema } from "./bases.js";

/** 英文源数据「阵营」格式 */
export interface OracleSideSchema extends OracleBaseSchema {
    /** 阵营名称 */
    readonly name: string;
}

/** 本地化数据「阵营」格式 */
export interface LocaleSideSchema extends LocaleBaseSchema {
    /** 阵营名称 */
    readonly name: string;
}
