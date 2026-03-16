import { env } from '../../../config/env';
import { generateShortCode } from '../../../utils/base62';
import { getUrlRepository, getAnalyticsRepository } from '../repositories/urlRepository';
import type {
  ShortenUrlOptions,
  BulkRow,
  BulkCreated,
  BulkError,
  GetUserUrlsFilters,
  ClickMeta
} from '../schemas/urlSchemas';

const BULK_MAX_ROWS = 100;

export async function createShortUrl(options: ShortenUrlOptions) {
  const { userId, originalUrl, customAlias, expiresAt, folderId } = options;
  const urlRepo = getUrlRepository();
  const expiresAtDate =
    expiresAt != null && String(expiresAt).trim() !== ''
      ? new Date(expiresAt as string)
      : null;
  const expiresAtValid =
    expiresAtDate != null && !Number.isNaN(expiresAtDate.getTime()) ? expiresAtDate : null;

  let shortCode = customAlias || generateShortCode(6);

  if (customAlias) {
    const existingCustom = await urlRepo.findOne({ where: { shortCode: customAlias } });
    if (existingCustom) {
      throw new Error('Short code not available. Please use another.');
    }
  } else {
    let exists = await urlRepo.findOne({ where: { shortCode } });
    while (exists) {
      shortCode = generateShortCode(6);
      exists = await urlRepo.findOne({ where: { shortCode } });
    }
  }

  const url = urlRepo.create({
    userId: userId ?? null,
    originalUrl,
    shortCode,
    expiresAt: expiresAtValid,
    folderId: folderId ?? null
  });

  const saved = await urlRepo.save(url);
  const shortUrl = `${env.baseUrl}/${saved.shortCode}`;
  return { url: saved, shortUrl };
}

export async function createShortUrlBulk(
  userId: string,
  rows: BulkRow[],
  folderId?: string | null
): Promise<{ created: BulkCreated[]; errors: BulkError[] }> {
  if (rows.length > BULK_MAX_ROWS) {
    throw new Error(`Maximum ${BULK_MAX_ROWS} rows per import.`);
  }
  const created: BulkCreated[] = [];
  const errors: BulkError[] = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const originalUrl = typeof row.url === 'string' ? row.url.trim() : '';
    if (!originalUrl) {
      errors.push({ row: i + 1, message: 'Missing or empty URL.' });
      continue;
    }
    try {
      const result = await createShortUrl({
        userId,
        originalUrl,
        customAlias: row.customAlias?.trim() || undefined,
        expiresAt: row.expiresAt ?? null,
        folderId: folderId ?? null
      });
      created.push({
        id: result.url.id,
        shortUrl: result.shortUrl,
        originalUrl: result.url.originalUrl,
        shortCode: result.url.shortCode
      });
    } catch (err) {
      errors.push({
        row: i + 1,
        url: originalUrl,
        message: (err as Error).message
      });
    }
  }
  return { created, errors };
}

export async function getOriginalUrl(
  shortCode: string,
  userId?: string | null
): Promise<string | null> {
  const urlRepo = getUrlRepository();
  const where = userId != null ? { shortCode, userId } : { shortCode };
  const url = await urlRepo.findOne({ where });
  if (!url) return null;

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const now = Date.now();
  if (url.activeFrom != null && url.activeFrom.getTime() > now) return null;
  if (url.activeTo != null && url.activeTo.getTime() < now) return null;

  return url.originalUrl;
}

export async function incrementClickAndTrack(
  shortCode: string,
  meta: ClickMeta,
  userId?: string | null
): Promise<void> {
  const urlRepo = getUrlRepository();
  const analyticsRepo = getAnalyticsRepository();
  const where = userId != null ? { shortCode, userId } : { shortCode };
  const url = await urlRepo.findOne({ where });
  if (!url) return;

  url.clickCount += 1;
  await urlRepo.save(url);

  const record = analyticsRepo.create({
    urlId: url.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    referrer: meta.referrer,
    country: meta.country,
    browser: meta.browser
  });
  await analyticsRepo.save(record);
}

export async function getUserUrls(
  userId: string,
  page = 1,
  limit = 10,
  filters: GetUserUrlsFilters = {}
) {
  const { folderId, search, from, to, expired, hasClicks } = filters;
  const urlRepo = getUrlRepository();
  const qb = urlRepo
    .createQueryBuilder('url')
    .leftJoinAndSelect('url.folder', 'folder')
    .where('url.userId = :userId', { userId })
    .orderBy('url.createdAt', 'DESC');

  if (folderId !== undefined && folderId !== null && folderId !== '') {
    qb.andWhere('url.folderId = :folderId', { folderId });
  }
  if (search && search.trim()) {
    const term = `%${search.trim()}%`;
    qb.andWhere('(url.shortCode ILIKE :term OR url.originalUrl ILIKE :term)', { term });
  }
  if (from) {
    qb.andWhere('url.createdAt >= :from', { from: new Date(from) });
  }
  if (to) {
    qb.andWhere('url.createdAt <= :to', { to: new Date(to) });
  }
  if (expired === true) {
    qb.andWhere('url.expiresAt IS NOT NULL AND url.expiresAt < :now', { now: new Date() });
  } else if (expired === false) {
    qb.andWhere('(url.expiresAt IS NULL OR url.expiresAt >= :now)', { now: new Date() });
  }
  if (hasClicks === true) {
    qb.andWhere('url.clickCount > 0');
  } else if (hasClicks === false) {
    qb.andWhere('url.clickCount = 0');
  }

  const [items, total] = await qb
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();

  return { items, total, page, limit };
}

export async function getUrlAnalytics(urlId: string) {
  const urlRepo = getUrlRepository();
  const analyticsRepo = getAnalyticsRepository();
  const url = await urlRepo.findOne({ where: { id: urlId } });
  if (!url) {
    throw new Error('URL not found');
  }
  const records = await analyticsRepo.find({
    where: { urlId },
    order: { createdAt: 'DESC' }
  });
  return { url, records };
}

export async function deleteUrl(id: string, userId: string): Promise<void> {
  const urlRepo = getUrlRepository();
  const url = await urlRepo.findOne({ where: { id, userId } });
  if (!url) {
    throw new Error('URL not found');
  }
  await urlRepo.remove(url);
}

export async function updateUrlFolder(
  id: string,
  userId: string,
  folderId: string | null
): Promise<void> {
  const urlRepo = getUrlRepository();
  const url = await urlRepo.findOne({ where: { id, userId } });
  if (!url) throw new Error('URL not found');
  url.folderId = folderId;
  await urlRepo.save(url);
}

export async function updateUrlSchedule(
  id: string,
  userId: string,
  options: { activeFrom?: Date | null; activeTo?: Date | null }
): Promise<void> {
  const urlRepo = getUrlRepository();
  const url = await urlRepo.findOne({ where: { id, userId } });
  if (!url) throw new Error('URL not found');
  if (options.activeFrom !== undefined) url.activeFrom = options.activeFrom;
  if (options.activeTo !== undefined) url.activeTo = options.activeTo;
  await urlRepo.save(url);
}

export async function updateUrlDetails(
  id: string,
  userId: string,
  updates: {
    originalUrl?: string;
    customAlias?: string | null;
    expiresAt?: Date | null;
  }
): Promise<void> {
  const urlRepo = getUrlRepository();
  const url = await urlRepo.findOne({ where: { id, userId } });
  if (!url) throw new Error('URL not found');

  const originalShortCode = url.shortCode;

  if (updates.originalUrl !== undefined) {
    const trimmed = updates.originalUrl.trim();
    if (!trimmed) {
      throw new Error('Please enter a destination URL.');
    }
    url.originalUrl = trimmed;
  }

  if (updates.customAlias !== undefined) {
    const alias = updates.customAlias;
    if (alias === null || alias.trim() === '') {
      url.customAlias = undefined;
    } else {
      const trimmedAlias = alias.trim();
      const existing = await urlRepo.findOne({ where: { shortCode: trimmedAlias } });
      if (existing && existing.id !== url.id) {
        throw new Error('Short code not available. Please use another.');
      }
      url.shortCode = trimmedAlias;
      url.customAlias = trimmedAlias;
    }
  }

  if (updates.expiresAt !== undefined) {
    url.expiresAt = updates.expiresAt;
  }

  await urlRepo.save(url);
}
