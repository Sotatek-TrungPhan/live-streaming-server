import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('members')
export class Member {
  @PrimaryGeneratedColumn('uuid')
  memberId: string;

  @Column({ type: 'varchar', nullable: true })
  memberCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  lineId: string | null;

  @Column({ type: 'varchar', nullable: true })
  displayName: string | null;

  @Column({ type: 'varchar', nullable: true })
  picUrl: string | null;

  @Column({ type: 'varchar', nullable: true })
  firstName: string | null;

  @Column({ type: 'varchar', nullable: true })
  lastName: string | null;

  @Column({ type: 'varchar', nullable: true })
  email: string | null;

  @Column({ type: 'varchar', nullable: true })
  telephone: string | null;

  @Column({ type: 'varchar', nullable: true })
  password: string;

  @Column({ type: 'boolean', default: false })
  isRegistered: boolean;

  @Column({ type: 'boolean', default: false })
  isFriends: boolean;

  @Column({ type: 'jsonb', nullable: true })
  memberInfo: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
