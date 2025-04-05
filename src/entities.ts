import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn, Relation } from 'typeorm';

export const SPLITTER: string = "|||";

/** 数据库实体通用字段 */
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
}

/** 数据库实体「阵营」 */
@Entity({ name: "sides" })
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
@Entity({ name: "factions" })
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
@Entity({ name: "types" })
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

    /** 类型所属阵营ID */
    @Column()
    side_codename: string = "";

    /** 类型所属阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;
}

/** 数据库实体「子类型」 */
@Entity({ name: "subtypes" })
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
@Entity({ name: "settypes" })
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

/** 数据库实体「循环」 */
@Entity({ name: "cycles" })
export class CycleEntity extends BaseEntity {
    /** 循环唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 循环英文名称 */
    @Column()
    oracle_name: string = "";

    /** 循环本地化名称 */
    @Column()
    locale_name: string = "";

    /** 循环序号 */
    @Column()
    position: number = 0;

    /** 循环发行组 */
    @Column()
    released_by: string = "";
}

/** 数据库实体「卡包」 **/
@Entity({ name: "sets" })
export class SetEntity extends BaseEntity {
    /** 卡包唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 卡包英文名称 */
    @Column()
    oracle_name: string = "";

    /** 卡包本地化名称 */
    @Column()
    locale_name: string = "";

    /** 卡包所属循环ID */
    @Column()
    cycle_codename: string = "";

    /** 卡包所属循环 */
    @ManyToOne(() => CycleEntity)
    cycle!: Relation<CycleEntity>;

    /** 卡包所属卡包类型ID */
    @Column()
    settype_codename: string = "";

    /** 卡包所属卡包类型 */
    @ManyToOne(() => SettypeEntity)
    settype!: Relation<SettypeEntity>;

    /** 卡包发行日期 */
    @Column()
    release_date: string = "";

    /** 卡包在循环中位置 */
    @Column()
    position: number = 0;

    /** 卡包卡牌数量 */
    @Column()
    size: number = 0;

    /** 卡包发行组 */
    @Column()
    released_by: string = "";
}

/** 数据库实体「赛制」 */
@Entity({ name: "formats" })
export class FormatEntity extends BaseEntity {
    /** 赛制唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 赛制英文名称 */
    @Column()
    oracle_name: string = "";

    /** 赛制本地化名称 */
    @Column()
    locale_name: string = "";
}

/** 数据库实体「卡池」 */
@Entity({ name: "pools" })
export class PoolEntity extends BaseEntity {
    /** 卡池唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 卡池英文名称 */
    @Column()
    oracle_name: string = "";

    /** 卡池所属赛制ID */
    @Column()
    format_codename: string = "";

    /** 卡池所属赛制 */
    @ManyToOne(() => FormatEntity)
    format!: Relation<FormatEntity>

    /** 卡池包含卡包ID */
    @Column({ type: "varchar", length: 5000 })
    set_codename_list: string = "";

    public get set_codenames(): string[] {
        return this.set_codename_list.split(SPLITTER);
    }

    /** 卡池包含循环ID */
    @Column({ type: "varchar", length: 5000 })
    cycle_codename_list: string = "";

    public get cycle_codenames(): string[] {
        return this.cycle_codename_list.split(SPLITTER);
    }
}
