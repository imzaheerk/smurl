import { AppDataSource } from '../config/data-source';
import { CustomDomain } from '../entities/CustomDomain';

const repo = () => AppDataSource.getRepository(CustomDomain);

/** Normalize domain: lowercase, no port, no protocol */
export function normalizeDomain(domain: string): string {
  let d = domain.trim().toLowerCase();
  d = d.replace(/^https?:\/\//, '');
  const portIdx = d.indexOf(':');
  if (portIdx !== -1) d = d.slice(0, portIdx);
  const slashIdx = d.indexOf('/');
  if (slashIdx !== -1) d = d.slice(0, slashIdx);
  return d;
}

export async function addCustomDomain(userId: string, domain: string): Promise<CustomDomain> {
  const normalized = normalizeDomain(domain);
  if (!normalized) throw new Error('Invalid domain');

  const existing = await repo().findOne({ where: { domain: normalized } });
  if (existing) {
    if (existing.userId === userId) throw new Error('You already added this domain');
    throw new Error('This domain is already in use by another account');
  }

  const customDomain = repo().create({
    userId,
    domain: normalized,
    verified: false
  });
  return repo().save(customDomain);
}

export async function listCustomDomains(userId: string): Promise<CustomDomain[]> {
  return repo().find({
    where: { userId },
    order: { createdAt: 'DESC' }
  });
}

export async function deleteCustomDomain(id: string, userId: string): Promise<void> {
  const row = await repo().findOne({ where: { id, userId } });
  if (!row) throw new Error('Custom domain not found');
  await repo().remove(row);
}

/** Resolve userId for a request host. Returns null if host is default or not a registered custom domain. */
export async function findUserIdByHost(host: string): Promise<string | null> {
  const normalized = normalizeDomain(host);
  const row = await repo().findOne({ where: { domain: normalized } });
  return row?.userId ?? null;
}
