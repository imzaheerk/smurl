import { AppDataSource } from '../config/data-source';
import { env } from '../config/env';
import { Analytics } from '../entities/Analytics';
import { Url } from '../entities/Url';
import { generateShortCode } from '../utils/base62';

const urlRepo = () => AppDataSource.getRepository(Url);
const analyticsRepo = () => AppDataSource.getRepository(Analytics);

export interface ShortenUrlOptions {
  userId?: string | null;
  originalUrl: string;
  customAlias?: string;
  expiresAt?: Date | null;
  folderId?: string | null;
}

export const createShortUrl = async (options: ShortenUrlOptions) => {
  const { userId, originalUrl, customAlias, expiresAt, folderId } = options;

  let shortCode = customAlias || generateShortCode(6);

  if (customAlias) {
    const existingCustom = await urlRepo().findOne({ where: { shortCode: customAlias } });
    if (existingCustom) {
      throw new Error('Short code not available. Please use another.');
    }
  } else {
    // Ensure uniqueness
    let exists = await urlRepo().findOne({ where: { shortCode } });
    while (exists) {
      shortCode = generateShortCode(6);
      exists = await urlRepo().findOne({ where: { shortCode } });
    }
  }

  const url = urlRepo().create({
    userId: userId ?? null,
    originalUrl,
    shortCode,
    expiresAt: expiresAt ?? null,
    folderId: folderId ?? null
  });

  const saved = await urlRepo().save(url);
  const shortUrl = `${env.baseUrl}/${saved.shortCode}`;
  return { url: saved, shortUrl };
};

const BULK_MAX_ROWS = 100;

export interface BulkRow {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface BulkCreated {
  id: string;
  shortUrl: string;
  originalUrl: string;
  shortCode: string;
}

export interface BulkError {
  row: number;
  url?: string;
  message: string;
}

export const createShortUrlBulk = async (
  userId: string,
  rows: BulkRow[],
  folderId?: string | null
) => {
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
      const expiresAt =
        row.expiresAt != null && String(row.expiresAt).trim() !== ''
          ? new Date(row.expiresAt)
          : null;
      const result = await createShortUrl({
        userId,
        originalUrl,
        customAlias: row.customAlias?.trim() || undefined,
        expiresAt: Number.isNaN(expiresAt?.getTime()) ? null : expiresAt,
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
};

/** When userId is set (custom domain), only resolve if the link belongs to that user. */
export const getOriginalUrl = async (shortCode: string, userId?: string | null): Promise<string | null> => {
  const where = userId != null
    ? { shortCode, userId }
    : { shortCode };
  const url = await urlRepo().findOne({ where });
  if (!url) return null;

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    return null;
  }

  const now = Date.now();
  if (url.activeFrom != null && url.activeFrom.getTime() > now) return null;
  if (url.activeTo != null && url.activeTo.getTime() < now) return null;

  return url.originalUrl;
};

/** When userId is set (custom domain), only track if the link belongs to that user. */
export const incrementClickAndTrack = async (shortCode: string, meta: {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  browser?: string;
}, userId?: string | null) => {
  const where = userId != null ? { shortCode, userId } : { shortCode };
  const url = await urlRepo().findOne({ where });
  if (!url) return;

  url.clickCount += 1;
  await urlRepo().save(url);

  const record = analyticsRepo().create({
    urlId: url.id,
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
    referrer: meta.referrer,
    country: meta.country,
    browser: meta.browser
  });
  await analyticsRepo().save(record);
};

export interface GetUserUrlsFilters {
  folderId?: string | null;
  search?: string;
  from?: string; // ISO date, createdAt >= from
  to?: string;   // ISO date, createdAt <= to
  expired?: boolean; // true = only expired, false = only active
  hasClicks?: boolean; // true = only with clicks > 0
}

export const getUserUrls = async (
  userId: string,
  page = 1,
  limit = 10,
  filters: GetUserUrlsFilters = {}
) => {
  const { folderId, search, from, to, expired, hasClicks } = filters;
  const qb = urlRepo()
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
};

export const getUrlAnalytics = async (urlId: string) => {
  const url = await urlRepo().findOne({ where: { id: urlId } });
  if (!url) {
    throw new Error('URL not found');
  }
  const records = await analyticsRepo().find({
    where: { urlId },
    order: { createdAt: 'DESC' }
  });
  return { url, records };
};

export const deleteUrl = async (id: string, userId: string) => {
  const url = await urlRepo().findOne({ where: { id, userId } });
  if (!url) {
    throw new Error('URL not found');
  }
  await urlRepo().remove(url);
};

export const updateUrlFolder = async (id: string, userId: string, folderId: string | null) => {
  const url = await urlRepo().findOne({ where: { id, userId } });
  if (!url) throw new Error('URL not found');
  url.folderId = folderId;
  await urlRepo().save(url);
};

export const updateUrlSchedule = async (
  id: string,
  userId: string,
  options: { activeFrom?: Date | null; activeTo?: Date | null }
) => {
  const url = await urlRepo().findOne({ where: { id, userId } });
  if (!url) throw new Error('URL not found');
  if (options.activeFrom !== undefined) url.activeFrom = options.activeFrom;
  if (options.activeTo !== undefined) url.activeTo = options.activeTo;
  await urlRepo().save(url);
};

