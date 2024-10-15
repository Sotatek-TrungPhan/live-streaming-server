import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Channel {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty()
  @Column()
  name: string;

  @ApiProperty()
  @Column()
  description: string;

  @ApiProperty()
  @Column()
  ownerId: string;

  @ApiProperty()
  @Column()
  isPrivate: boolean;

  @ApiProperty()
  @Column({ default: 0 })
  viewerCount: number;

  @ApiProperty()
  @Column({ default: false })
  isLive: boolean;

  @ApiProperty()
  @Column()
  createdAt: Date;

  @ApiProperty()
  @Column()
  updatedAt: Date;
}
