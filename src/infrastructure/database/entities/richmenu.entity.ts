import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity('richmenus')
export class RichMenuEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  richMenuId: string;

  @Column({ unique: true })
  alias: string;

  @Column()
  name: string;

  @Column({ default: false })
  isDisplayed: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
