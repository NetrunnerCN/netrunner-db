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

/** 数据库实体「禁限表」 */
@Entity({ name: "restrictions" })
export class RestrictionEntity extends BaseEntity {
    /** 禁限表唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 禁限表英文名称 */
    @Column()
    oracle_name: string = "";

    /** 禁限表所属赛制ID */
    @Column()
    format_codename: string = "";

    /** 禁限表所属赛制 */
    @ManyToOne(() => FormatEntity)
    format!: Relation<FormatEntity>

    /** 禁限表开始日期 */
    @Column()
    start_date: string = "";

    /** 禁限表禁止卡牌ID */
    @Column({ type: "varchar", length: 5000 })
    banned_card_codename_list: string = "";

    public get banned_card_codenames(): string[] {
        return this.banned_card_codename_list.split(SPLITTER);
    }

    /** 禁限表禁止子类型ID */
    @Column({ type: "varchar", length: 5000 })
    banned_subtype_codename_list: string = "";

    public get banned_subtype_codenames(): string[] {
        return this.banned_subtype_codename_list.split(SPLITTER);
    }
}

/** 数据库实体「环境」 */
@Entity({ name: "snapshots" })
export class SnapshotEntity extends BaseEntity {
    /** 环境唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 环境开始日期 */
    @Column()
    start_date: string = "";

    /** 环境所属赛制ID */
    @Column()
    format_codename: string = "";

    /** 环境所属赛制 */
    @ManyToOne(() => FormatEntity)
    format!: Relation<FormatEntity>;

    /** 环境使用禁限表ID */
    @Column()
    restriction_codename: string = "";

    /** 环境使用禁限表 */
    @ManyToOne(() => RestrictionEntity)
    restriction!: Relation<RestrictionEntity>;

    /** 环境使用卡池ID */
    @Column()
    pool_codename: string = "";

    /** 环境使用卡池 */
    @ManyToOne(() => PoolEntity)
    pool!: Relation<PoolEntity>;

    /** 环境是否当前使用 */
    @Column()
    active: boolean = false;
}

/** 数据库实体「卡牌」 */
@Entity({ name: "cards" })
export class CardEntity extends BaseEntity {
    /** 卡牌唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 卡牌英文名称 */
    @Column()
    oracle_title: string = "";

    /** 卡牌本地化名称 */
    @Column()
    locale_title: string = "";

    /** 卡牌英文名称（ASCII） */
    @Column()
    stripped_title: string = "";

    /** 卡牌英文文本 */
    @Column({ type: "varchar", length: 1000 })
    oracle_text: string = "";

    /** 卡牌本地化文本 */
    @Column({ type: "varchar", length: 1000 })
    locale_text: string = "";

    /** 卡牌英文文本（ASCII） */
    @Column({ type: "varchar", length: 1000 })
    stripped_text: string = "";

    /** 卡牌类型ID */
    @Column()
    type_codename: string = "";

    /** 卡牌类型 */
    @ManyToOne(() => TypeEntity)
    type!: Relation<TypeEntity>;

    /** 卡牌子类型ID */
    @Column()
    subtype_codename_list: string = "";

    public get subtype_codenames(): string[] {
        return this.subtype_codename_list.split(SPLITTER);
    }

    /** 卡牌阵营ID */
    @Column()
    side_codename: string = "";

    /** 卡牌阵营 */
    @ManyToOne(() => SideEntity)
    side!: Relation<SideEntity>;

    /** 卡牌派系ID */
    @Column()
    faction_codename: string = "";

    /** 卡牌派系 */
    @ManyToOne(() => FactionEntity)
    faction!: Relation<FactionEntity>;

    /** 卡牌是否独有 */
    @Column()
    is_unique: boolean = false;

    /** 卡牌牌组限制 */
    @Column({ type: "int", nullable: true })
    deck_limit: number | undefined = undefined;

    /** 卡牌推进需求 */
    @Column({ type: "int", nullable: true })
    advancement_requirement: number | undefined = undefined;

    /** 卡牌议案分数 */
    @Column({ type: "int", nullable: true })
    agenda_point: number | undefined = undefined;

    /** 卡牌基础中转 */
    @Column({ type: "int", nullable: true })
    base_link: number | undefined = undefined;

    /** 卡牌牌组最小张数 */
    @Column({ type: "int", nullable: true })
    minimum_deck_size: number | undefined = undefined;

    /** 卡牌牌组影响力上限 */
    @Column({ type: "int", nullable: true })
    influence_limit: number | undefined = undefined;

    /** 卡牌影响力费用 */
    @Column({ type: "int", nullable: true })
    influence_cost: number | undefined = undefined;

    /** 卡牌费用 */
    @Column({ type: "int", nullable: true })
    cost: number | undefined = undefined;

    /** 卡牌强度 */
    @Column({ type: "int", nullable: true })
    strength: number | undefined = undefined;

    /** 卡牌内存费用 */
    @Column({ type: "int", nullable: true })
    memory_cost: number | undefined = undefined;

    /** 卡牌销毁费用 */
    @Column({ type: "int", nullable: true })
    trash_cost: number | undefined = undefined;

    /** 卡牌冠名 */
    @Column()
    attribution: string = "";

    /** 卡牌设计组 */
    @Column()
    designed_by: string = "";

    /** 卡牌人称代词 */
    @Column()
    pronouns: string = "";

    /** 卡牌读音（国际音标） */
    @Column()
    pronunciation_ipa: string = "";

    /** 卡牌读音（英文音标） */
    @Column()
    pronunciation_approx: string = "";

    /** 卡牌额外牌面数 */
    @Column()
    extra_face: number = 0;
}

/** 数据库实体「卡图」 */
@Entity({ name: "printings" })
export class PrintingEntity extends BaseEntity {
    /** 卡图唯一标识 */
    @Column()
    @Index({ unique: true })
    codename: string = "";

    /** 卡图卡牌ID */
    @Column()
    card_codename: string = "";

    /** 卡图卡牌 */
    @ManyToOne(() => CardEntity)
    card!: Relation<CardEntity>;

    /** 卡图所属卡包ID */
    @Column()
    set_codename: string = "";

    /** 卡图所属卡包 */
    @ManyToOne(() => SetEntity)
    set!: Relation<SetEntity>;

    /** 卡图序号 */
    @Column()
    position: number = 0;

    /** 卡图英文风味文字 */
    @Column({ type: "varchar", length: 1000 })
    oracle_flavor: string = "";

    /** 卡图本地化风味文字 */
    @Column({ type: "varchar", length: 1000 })
    locale_flavor: string = "";

    /** 卡图数量 */
    @Column()
    quantity: number = 0;

    /** 卡图插画作者 */
    @Column()
    illustrator: string = "";

    /** 卡图发行组 */
    @Column()
    released_by: string = "";
}
