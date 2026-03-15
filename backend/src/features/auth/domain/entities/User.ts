import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn
} from 'typeorm';
import type { Url } from '../../../url/domain/entities/Url';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(
    () => require('../../../url/domain/entities/Url').Url,
    (url: { user?: User | null }) => url.user
  )
  urls!: Url[];
}
