import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { User } from '../domain/entities/User';

export function getUserRepository(): Repository<User> {
  return AppDataSource.getRepository(User);
}
