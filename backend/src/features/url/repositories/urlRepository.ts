import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { Url } from '../domain/entities/Url';
import { Analytics } from '../domain/entities/Analytics';

export function getUrlRepository(): Repository<Url> {
  return AppDataSource.getRepository(Url);
}

export function getAnalyticsRepository(): Repository<Analytics> {
  return AppDataSource.getRepository(Analytics);
}
