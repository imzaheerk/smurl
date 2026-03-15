import { getFolderRepository, getUrlRepositoryForFolder } from '../repositories/folderRepository';
import type { FolderWithStats } from '../schemas/folderSchemas';

export async function createFolder(userId: string, name: string) {
  const folderRepo = getFolderRepository();
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Folder name is required');

  const folder = folderRepo.create({
    userId,
    name: trimmed
  });
  return folderRepo.save(folder);
}

export async function listFolders(userId: string) {
  const folderRepo = getFolderRepository();
  return folderRepo.find({
    where: { userId },
    order: { name: 'ASC' }
  });
}

export async function listFoldersWithStats(userId: string): Promise<FolderWithStats[]> {
  const folderRepo = getFolderRepository();
  const urlRepo = getUrlRepositoryForFolder();
  const folders = await folderRepo.find({
    where: { userId },
    order: { name: 'ASC' }
  });

  const result: FolderWithStats[] = [];
  for (const f of folders) {
    const urls = await urlRepo.find({ where: { folderId: f.id } });
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
  const folderRepo = getFolderRepository();
  const urlRepo = getUrlRepositoryForFolder();
  const folder = await folderRepo.findOne({ where: { id, userId } });
  if (!folder) throw new Error('Folder not found');

  await urlRepo.update({ folderId: id }, { folderId: null });
  await folderRepo.remove(folder);
}

export async function getFolder(id: string, userId: string) {
  const folderRepo = getFolderRepository();
  return folderRepo.findOne({ where: { id, userId } });
}
