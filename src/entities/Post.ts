import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 255, nullable: false })
  title!: string;

  @Column({ type: "text", nullable: true })
  summary?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  source?: string;

  @Column({ type: "varchar", length: 500, nullable: true })
  imageLink?: string;

  @Column({ type: "varchar", length: 100, nullable: false, default: "General" })
  category!: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  subCategory?: string;

  @Column({ type: "varchar", length: 100, nullable: true })
  typeOfNews?: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  publisherName?: string;

  @Column({ type: "varchar", length: 50, nullable: true })
  dateOfNews?: string;

  @Column({ type: "float", nullable: true, default: 0 })
  scoring?: number;

  @Column({ type: "uuid", unique: true, default: () => "uuid_generate_v4()" })
  srNo!: string;

  @Column({ type: "text", nullable: true })
  content?: string;

  // @ManyToOne(() => User, (user) => user.name, { onDelete: "CASCADE" })
  // @JoinColumn({ name: "user_id" })
  // user!: User;

  @CreateDateColumn({ name: "created_at", type: "timestamp" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamp" })
  updatedAt!: Date;
}
