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
}

export const createShortUrl = async (options: ShortenUrlOptions) => {
  const { userId, originalUrl, customAlias, expiresAt } = options;

  let shortCode = customAlias || generateShortCode(6);

  if (customAlias) {
    const existingCustom = await urlRepo().findOne({ where: { shortCode: customAlias } });
    if (existingCustom) {
      throw new Error('Custom alias already in use');
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
    expiresAt: expiresAt ?? null
  });

  const saved = await urlRepo().save(url);
  const shortUrl = `${env.baseUrl}/${saved.shortCode}`;
  return { url: saved, shortUrl };
};

export const getOriginalUrl = async (shortCode: string) => {
  const url = await urlRepo().findOne({ where: { shortCode } });
  if (!url) return null;

  if (url.expiresAt && url.expiresAt.getTime() < Date.now()) {
    return null;
  }

  return url.originalUrl;
};

export const incrementClickAndTrack = async (shortCode: string, meta: {
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  country?: string;
  browser?: string;
}) => {
  const url = await urlRepo().findOne({ where: { shortCode } });
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

export const getUserUrls = async (userId: string, page = 1, limit = 10) => {
  const [items, total] = await urlRepo().findAndCount({
    where: { userId },
    order: { createdAt: 'DESC' },
    skip: (page - 1) * limit,
    take: limit
  });
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

