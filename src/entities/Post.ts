import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from "typeorm";
import { User } from "./User.js";

@Entity()
export class News{
  @PrimaryGeneratedColumn()
  id!: number;

  // Title cannot be null, default is 'Untitled' for existing rows
  @Column({ length: 255, nullable: false, default: "Untitled" })
  title!: string;

  // Category cannot be null, default is 'General' for existing rows
  @Column({ length: 100, nullable: false, default: "General" })
  category!: string;

  // Content can be nullable
  @Column({ type: "text", nullable: true })
  content?: string;

  // Relation to User
  @ManyToOne(() => User, user => user.id)
  user!: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
