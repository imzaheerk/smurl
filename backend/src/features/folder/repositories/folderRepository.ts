import { Repository } from 'typeorm';
import { AppDataSource } from '../../../config/data-source';
import { Folder } from '../domain/entities/Folder';
import { Url } from '../../url/domain/entities/Url';

export function getFolderRepository(): Repository<Folder> {
  return AppDataSource.getRepository(Folder);
}

export function getUrlRepositoryForFolder(): Repository<Url> {
  return AppDataSource.getRepository(Url);
}
