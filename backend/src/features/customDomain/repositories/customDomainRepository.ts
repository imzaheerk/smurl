import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { CustomDomain } from '../domain/entities/CustomDomain';

export function getCustomDomainRepository(): Repository<CustomDomain> {
  return AppDataSource.getRepository(CustomDomain);
}
