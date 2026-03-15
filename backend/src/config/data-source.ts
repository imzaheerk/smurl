import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { env } from './env';
import { User } from '../features/auth/domain/entities/User';
import { Url } from '../features/url/domain/entities/Url';
import { Analytics } from '../features/url/domain/entities/Analytics';
import { CustomDomain } from '../features/customDomain/domain/entities/CustomDomain';
import { ApiKey } from '../features/apiKey/domain/entities/ApiKey';
import { Folder } from '../features/folder/domain/entities/Folder';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: env.db.host,
  port: env.db.port,
  username: env.db.username,
  password: env.db.password,
  database: env.db.database,
  entities: [User, Url, Analytics, CustomDomain, Folder, ApiKey],
  migrations: ['src/migrations/*.ts'],
  /** Use migrations in production; synchronize only in development for convenience. */
  synchronize: !env.isProduction,
  logging: false
});
