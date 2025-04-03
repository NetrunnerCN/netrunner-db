/** 英文源数据通用字段 */
export interface OracleBaseSchema {
    /** 唯一标识符 */
    readonly id: string;
}

/** 本地化数据通用字段 */
export interface LocaleBaseSchema {
    /** 唯一标识符 */
    readonly code: string;
}
