import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { SubCategory } from "./subCategory.js";

@Entity()
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({ type: "varchar", length: 100, unique: true })
  name!: string;

  @Column({ type: "text", nullable: true })
  description!: string;

  @OneToMany(() => SubCategory, (sub) => sub.category)
  subCategories!: SubCategory[];
}
