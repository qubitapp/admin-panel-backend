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
export class News {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false, default: "Untitled" })
  title!: string;

  @Column({ type: "varchar", length: 100, nullable: false, default: "General" })
  category!: string;

  @Column({ type: "text", nullable: true })
  content?: string;

  // ✅ Proper relation with explicit JoinColumn (recommended)
  @ManyToOne(() => User, (user) => user.name, { onDelete: "CASCADE" })
  user!: User;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
