import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from "typeorm";

/** 数据库实体通用字段 */
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
}

/** 数据库实体「阵营」 */
@Entity({ name: "side" })
export class SideEntity extends BaseEntity {
    /** 阵营唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 阵营英文名称 */
    @Column()
    oracle_name: string = "";

    /** 阵营本地化名称 */
    @Column()
    locale_name: string = "";
}

/** 数据库实体「派系」 */
@Entity({ name: "faction" })
export class FactionEntity extends BaseEntity {
    /** 派系唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 派系英文名称 */
    @Column()
    oracle_name: string = "";

    /** 派系本地化名称 */
    @Column()
    locale_name: string = "";

    /** 派系英文描述 */
    @Column({ type: "varchar", length: 4096 })
    oracle_desc: string = "";

    /** 派系本地化描述 */
    @Column({ type: "varchar", length: 4096 })
    locale_desc: string = "";

    /** 派系颜色 */
    @Column()
    color: string = "";

    /** 派系是否为迷你派系 */
    @Column()
    is_mini: boolean = false;

    /** 派系所属阵营ID */
    @Column()
    side_codename: string = "";

    /** 派系所属阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;
}

/** 数据库实体「类型」 */
@Entity({ name: "type" })
export class TypeEntity extends BaseEntity {
    /** 类型唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 类型英文名称 */
    @Column()
    oracle_name: string = "";

    /** 类型本地化名称 */
    @Column()
    locale_name: string = "";

    /** 类型所属ID */
    @Column()
    side_codename: string = "";

    /** 类型所属阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;
}

/** 数据库实体「子类型」 */
@Entity({ name: "subtype" })
export class SubtypeEntity extends BaseEntity {
    /** 子类型唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 子类型英文名称 */
    @Column()
    oracle_name: string = "";

    /** 子类型本地化名称 */
    @Column()
    locale_name: string = "";
}

/** 数据库实体「卡包类型」 */
@Entity({ name: "settype" })
export class SettypeEntity extends BaseEntity {
    /** 卡包类型唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 卡包类型英文名称 */
    @Column()
    oracle_name: string = "";

    /** 卡包类型本地化名称 */
    @Column()
    locale_name: string = "";

    /** 卡包类型英文描述 */
    @Column({ type: "varchar", length: 1000 })
    oracle_desc: string = "";

    /** 卡包类型本地化描述 */
    @Column({ type: "varchar", length: 1000 })
    locale_desc: string = "";
}
