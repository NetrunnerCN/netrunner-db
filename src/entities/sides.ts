import { Column, Entity, Index } from "typeorm";
import { BaseEntity } from "./bases.js";

@Entity({ name: "side" })
export class SideEntity extends BaseEntity {
  @Column({ name: "codename", type: "varchar", length: 255 })
  @Index({ unique: true })
  codename!: string;

  @Column({ name: "oracle_name", type: "varchar", length: 255 })
  oracle_name!: string;

  @Column({ name: "locale_name", type: "varchar", length: 255 })
  locale_name!: string;
}
