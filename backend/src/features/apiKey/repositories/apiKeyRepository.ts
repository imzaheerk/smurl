import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { ApiKey } from '../domain/entities/ApiKey';

export function getApiKeyRepository(): Repository<ApiKey> {
  return AppDataSource.getRepository(ApiKey);
}
