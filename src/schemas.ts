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

/** 英文源数据「派系」格式 */
export interface OracleFactionSchema extends OracleBaseSchema {
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

/** 本地化数据「派系」格式 */
export interface LocaleFactionSchema extends LocaleBaseSchema {
    /** 派系名称 */
    readonly name: string;
    /** 派系描述 */
    readonly description: string;
}
