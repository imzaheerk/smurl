import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../entities/User';
import { Url } from '../entities/Url';
import { Analytics } from '../entities/Analytics';
import { CustomDomain } from '../entities/CustomDomain';
import { ApiKey } from '../entities/ApiKey';
import { Folder } from '../entities/Folder';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [User, Url, Analytics, CustomDomain, Folder, ApiKey],
  synchronize: true,
  logging: false
});

