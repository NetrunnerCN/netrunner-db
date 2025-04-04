import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

/** 数据库实体通用字段 */
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
}

/** 数据库实体「阵营」格式 */
@Entity({ name: "side" })
export class SideEntity extends BaseEntity {
    /** 阵营唯一标识符 */
    @Column({ type: "varchar", length: 255 })
    @Index({ unique: true })
    codename: string = "";

    /** 阵营英文名称 */
    @Column({ type: "varchar", length: 255 })
    oracle_name: string = "";

    /** 阵营本地化名称 */
    @Column({ type: "varchar", length: 255 })
    locale_name: string = "";
}

/** 数据库实体「派系」格式 */
@Entity({ name: "faction" })
export class FactionEntity extends BaseEntity {
    /** 派系唯一标识 */
    @Column({ type: "varchar", length: 255 })
    @Index({ unique: true })
    codename: string = "";

    /** 派系英文名称 */
    @Column({ type: "varchar", length: 255 })
    oracle_name: string = "";

    /** 派系本地化名称 */
    @Column({ type: "varchar", length: 255 })
    locale_name: string = "";

    /** 派系英文描述 */
    @Column({ type: "varchar", length: 4096 })
    oracle_desc: string = "";

    /** 派系本地化描述 */
    @Column({ type: "varchar", length: 4096 })
    locale_desc: string = "";

    /** 派系颜色 */
    @Column({ type: "varchar", length: 255 })
    color: string = "";

    /** 派系是否为迷你派系 */
    @Column({ type: "varchar", length: 255 })
    is_mini: string = "";

    /** 派系所属阵营ID */
    @Column({ type: "varchar", length: 255 })
    side_codename: string = "";

    /** 派系所属阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;
}

/** 数据库实体「类型」格式 */
@Entity({ name: "type" })
export class TypeEntity extends BaseEntity {
    /** 类型唯一标识 */
    @Column({ type: "varchar", length: 255 })
    @Index({ unique: true })
    codename: string = "";

    /** 类型英文名称 */
    @Column({ type: "varchar", length: 255 })
    oracle_name: string = "";

    /** 类型本地化名称 */
    @Column({ type: "varchar", length: 255 })
    locale_name: string = "";

    /** 类型所属ID */
    @Column({ type: "varchar", length: 255 })
    side_codename: string = "";

    /** 类型所属阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;
}

/** 数据库实体「子类型」格式 */
@Entity({ name: "subtype" })
export class SubtypeEntity extends BaseEntity {
    /** 子类型唯一标识 */
    @Column({ type: "varchar", length: 255 })
    @Index({ unique: true })
    codename: string = "";

    /** 子类型英文名称 */
    @Column({ type: "varchar", length: 255 })
    oracle_name: string = "";

    /** 子类型本地化名称 */
    @Column({ type: "varchar", length: 255 })
    locale_name: string = "";
}
