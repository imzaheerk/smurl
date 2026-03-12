import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { Url } from './Url';

@Entity()
export class Analytics {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  urlId!: string;

  @ManyToOne(() => Url, (url) => url.analytics, { onDelete: 'CASCADE' })
  url!: Url;

  @Column({ nullable: true })
  ipAddress?: string;

  @Column({ nullable: true })
  userAgent?: string;

  @Column({ nullable: true })
  referrer?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  browser?: string;

  @CreateDateColumn()
  createdAt!: Date;
}

