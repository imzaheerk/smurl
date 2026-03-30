import api from '../api';
import { GUEST_TOKEN, isGuestSession } from '../../utils/demoMode';
import { DEMO_API_KEYS, DEMO_DOMAINS, makeDemoCreatedKey } from '../demoData';

// --- Types ---
export interface CustomDomainRow {
  id: string;
  domain: string;
  verified: boolean;
  createdAt: string;
}

export interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
}

export interface CreateApiKeyResult {
  id: string;
  name: string;
  key: string;
  keyPrefix: string;
  createdAt: string;
}

// --- API ---
export async function getCustomDomains(): Promise<CustomDomainRow[]> {
  if (isGuestSession()) return DEMO_DOMAINS;
  try {
    const res = await api.get<CustomDomainRow[]>('/custom-domains');
    return res.data;
  } catch {
    return DEMO_DOMAINS;
  }
}

export async function addCustomDomain(domain: string): Promise<void> {
  if (isGuestSession()) return;
  await api.post('/custom-domains', { domain });
}

export async function deleteCustomDomain(id: string): Promise<void> {
  if (isGuestSession()) return;
  await api.delete(`/custom-domains/${id}`);
}

export async function getApiKeys(): Promise<ApiKeyRow[]> {
  if (isGuestSession()) return DEMO_API_KEYS;
  try {
    const res = await api.get<ApiKeyRow[]>('/api-keys');
    return res.data;
  } catch {
    return DEMO_API_KEYS;
  }
}

export async function createApiKey(name: string): Promise<CreateApiKeyResult> {
  if (isGuestSession()) return makeDemoCreatedKey(name);
  const res = await api.post<CreateApiKeyResult>('/api-keys', { name });
  return res.data;
}

export async function revokeApiKey(id: string): Promise<void> {
  if (isGuestSession()) return;
  await api.delete(`/api-keys/${id}`);
}

// --- Helpers ---
export function getEmailFromToken(token: string | null): string | null {
  if (token === GUEST_TOKEN) return 'guest@demo.local';
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded?.email === 'string' ? decoded.email : null;
  } catch {
    return null;
  }
}
