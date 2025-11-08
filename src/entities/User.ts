import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number; // ✅

  @Column({ length: 100 })
  name!: string;

  @Column({ unique: true, length: 150 })  
  email!: string;

  @Column({ length: 255 })
  password!: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;
}
