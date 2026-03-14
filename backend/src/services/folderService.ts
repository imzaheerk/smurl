import { AppDataSource } from '../config/data-source';
import { Folder } from '../entities/Folder';
import { Url } from '../entities/Url';

const folderRepo = () => AppDataSource.getRepository(Folder);
const urlRepo = () => AppDataSource.getRepository(Url);

export interface FolderWithStats {
  id: string;
  name: string;
  createdAt: Date;
  linkCount: number;
  totalClicks: number;
}

export async function createFolder(userId: string, name: string): Promise<Folder> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Folder name is required');

  const folder = folderRepo().create({
    userId,
    name: trimmed
  });
  return folderRepo().save(folder);
}

export async function listFolders(userId: string): Promise<Folder[]> {
  return folderRepo().find({
    where: { userId },
    order: { name: 'ASC' }
  });
}

export async function listFoldersWithStats(userId: string): Promise<FolderWithStats[]> {
  const folders = await folderRepo().find({
    where: { userId },
    order: { name: 'ASC' }
  });

  const result: FolderWithStats[] = [];
  for (const f of folders) {
    const urls = await urlRepo().find({ where: { folderId: f.id } });
    const totalClicks = urls.reduce((sum, u) => sum + u.clickCount, 0);
    result.push({
      id: f.id,
      name: f.name,
      createdAt: f.createdAt,
      linkCount: urls.length,
      totalClicks
    });
  }
  return result;
}

export async function deleteFolder(id: string, userId: string): Promise<void> {
  const folder = await folderRepo().findOne({ where: { id, userId } });
  if (!folder) throw new Error('Folder not found');

  await urlRepo().update({ folderId: id }, { folderId: null });
  await folderRepo().remove(folder);
}

export async function getFolder(id: string, userId: string): Promise<Folder | null> {
  return folderRepo().findOne({ where: { id, userId } });
}
