import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import type { User } from '../../../auth/domain/entities/User';
import type { Folder } from '../../../folder/domain/entities/Folder';
import { Analytics } from './Analytics';

@Entity()
export class Url {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  shortCode!: string;

  @Column()
  originalUrl!: string;

  @Column({ default: 0 })
  clickCount!: number;

  @Column({ nullable: true })
  customAlias?: string;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  activeFrom?: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  activeTo?: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @ManyToOne(
    () => require('../../../auth/domain/entities/User').User,
    (user: User) => user.urls,
    { onDelete: 'CASCADE', nullable: true }
  )
  user?: User | null;

  @Column({ nullable: true })
  userId?: string | null;

  @ManyToOne(
    () => require('../../../folder/domain/entities/Folder').Folder,
    (folder: Folder) => folder.urls,
    { onDelete: 'SET NULL', nullable: true }
  )
  folder?: Folder | null;

  @Column({ nullable: true })
  folderId?: string | null;

  @OneToMany(() => Analytics, (analytics) => analytics.url)
  analytics!: Analytics[];
}
