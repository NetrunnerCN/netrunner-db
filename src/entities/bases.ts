import { PrimaryGeneratedColumn } from "typeorm";

/** 数据库实体通用字段 */
export abstract class BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;
}
