import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./bases.js";

/** 数据库实体「阵营」格式 */
@Entity({ name: "side" })
export class SideEntity extends BaseEntity {
    /** 阵营唯一标识符 */
    @Column({ name: "codename", type: "varchar", length: 255 })
    @Index({ unique: true })
    codename!: string;

    /** 阵营英文名称 */
    @Column({ name: "oracle_name", type: "varchar", length: 255 })
    oracle_name!: string;

    /** 阵营本地化名称 */
    @Column({ name: "locale_name", type: "varchar", length: 255 })
    locale_name!: string;
}
