import {
  Entity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { genSaltSync, hashSync } from 'bcrypt';

@Entity('managers')
export class Manager {
  @PrimaryGeneratedColumn('uuid')
  managerId: string;

  @Column({ unique: true })
  username: string;

  @BeforeInsert()
  @BeforeUpdate()
  hashingPassword() {
    const salt = genSaltSync(16).toString();
    this.password = hashSync(this.password, salt).toString();
  }
  @Column({ type: 'varchar' })
  password: string;

  @Column({ default: 0 })
  authLevel: number;

  @Column({ default: false })
  isActivated: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
