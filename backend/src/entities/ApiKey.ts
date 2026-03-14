import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from './User';

@Entity()
export class ApiKey {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user!: User;

  /** SHA-256 hash of the secret key (never store plain key). */
  @Column()
  keyHash!: string;

  /** First 8 chars of the key for display (e.g. "sk_abc12…"). */
  @Column()
  keyPrefix!: string;

  @Column({ length: 100 })
  name!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
