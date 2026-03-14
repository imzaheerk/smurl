import { createHash, randomBytes } from 'crypto';
import { AppDataSource } from '../config/data-source';
import { ApiKey } from '../entities/ApiKey';
import { User } from '../entities/User';

const apiKeyRepo = () => AppDataSource.getRepository(ApiKey);
const userRepo = () => AppDataSource.getRepository(User);

const HASH_ALG = 'sha256';
const KEY_PREFIX = 'sk_';
const KEY_BYTES = 24; // 48 hex chars after prefix

function hashKey(plain: string): string {
  return createHash(HASH_ALG).update(plain, 'utf8').digest('hex');
}

function generateSecret(): string {
  return KEY_PREFIX + randomBytes(KEY_BYTES).toString('hex');
}

export interface CreateApiKeyResult {
  id: string;
  name: string;
  /** Shown only once at creation (e.g. "sk_abc123...") */
  key: string;
  keyPrefix: string;
  createdAt: Date;
}

export async function createApiKey(userId: string, name: string): Promise<CreateApiKeyResult> {
  const trimmed = name.trim();
  if (!trimmed) throw new Error('Key name is required.');
  const key = generateSecret();
  const keyHash = hashKey(key);
  const keyPrefix = key.slice(0, 12) + '…';

  const apiKey = apiKeyRepo().create({
    userId,
    keyHash,
    keyPrefix,
    name: trimmed
  });
  const saved = await apiKeyRepo().save(apiKey);
  return {
    id: saved.id,
    name: saved.name,
    key,
    keyPrefix: saved.keyPrefix,
    createdAt: saved.createdAt
  };
}

export interface ApiKeyListItem {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
}

export async function listApiKeys(userId: string): Promise<ApiKeyListItem[]> {
  const keys = await apiKeyRepo().find({
    where: { userId },
    order: { createdAt: 'DESC' }
  });
  return keys.map((k) => ({
    id: k.id,
    name: k.name,
    keyPrefix: k.keyPrefix,
    createdAt: k.createdAt.toISOString()
  }));
}

export async function revokeApiKey(id: string, userId: string): Promise<void> {
  const result = await apiKeyRepo().delete({ id, userId });
  if (result.affected === 0) throw new Error('API key not found or already revoked.');
}

/**
 * Validate a raw API key (e.g. from Authorization: Bearer <key>) and return the owning user, or null.
 */
export async function validateApiKey(plainKey: string): Promise<User | null> {
  if (!plainKey || !plainKey.startsWith(KEY_PREFIX)) return null;
  const keyHash = hashKey(plainKey);
  const apiKey = await apiKeyRepo().findOne({
    where: { keyHash },
    relations: ['user']
  });
  return apiKey?.user ?? null;
}
