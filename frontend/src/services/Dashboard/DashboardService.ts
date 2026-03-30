import api from '../api';
import { BASE_URL } from '../api';
import { isGuestSession } from '../../utils/demoMode';
import { DEMO_FOLDERS, makeDemoUrlsResponse } from '../demoData';

// --- Types ---
export interface FolderOption {
  id: string;
  name: string;
  linkCount: number;
  totalClicks: number;
}

export interface UrlItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  expiresAt?: string | null;
  activeFrom?: string | null;
  activeTo?: string | null;
  folderId?: string | null;
  folder?: { id: string; name: string } | null;
}

export interface UrlResponse {
  items: UrlItem[];
  total: number;
  page: number;
  limit: number;
}

export interface BulkImportRow {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

export interface BulkImportResult {
  created: { id: string; shortUrl: string; originalUrl: string; shortCode: string }[];
  errors: { row: number; url?: string; message: string }[];
}

export interface ShortenParams {
  url: string;
  customAlias?: string;
  expiresAt?: string;
  folderId?: string;
}

export interface ShortenResult {
  shortUrl: string;
}

// --- Helpers ---
export function parseCSV(csvText: string): BulkImportRow[] {
  const rows: BulkImportRow[] = [];
  const lines = csvText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const headerNames = ['url', 'long_url', 'original_url', 'long url', 'original', 'link'];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const parts: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let j = 0; j < line.length; j++) {
      const c = line[j];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === ',' && !inQuotes) || (c === '\t' && !inQuotes)) {
        parts.push(cur.trim());
        cur = '';
      } else {
        cur += c;
      }
    }
    parts.push(cur.trim());
    const firstCell = (parts[0] ?? '').replace(/^"|"$/g, '').trim().toLowerCase();
    if (i === 0 && headerNames.includes(firstCell)) continue;
    const url = (parts[0] ?? '').replace(/^"|"$/g, '').trim();
    if (!url) continue;
    rows.push({
      url,
      customAlias: (parts[1] ?? '').replace(/^"|"$/g, '').trim() || undefined,
      expiresAt: (parts[2] ?? '').replace(/^"|"$/g, '').trim() || undefined
    });
  }
  return rows;
}

// --- API ---
export async function getFolders(): Promise<FolderOption[]> {
  if (isGuestSession()) return DEMO_FOLDERS;
  try {
    const res = await api.get<FolderOption[]>('/folders');
    return res.data;
  } catch {
    return DEMO_FOLDERS;
  }
}

export interface GetMyUrlsParams {
  page: number;
  limit: number;
  folderId?: string;
  search?: string;
  expired?: boolean;
  hasClicks?: boolean;
}

export async function getMyUrls(params: GetMyUrlsParams): Promise<UrlResponse> {
  if (isGuestSession()) {
    return makeDemoUrlsResponse(
      params.page,
      params.limit,
      params.folderId,
      params.search,
      params.expired,
      params.hasClicks
    );
  }
  try {
    const res = await api.get<UrlResponse>('/url/my-urls', { params });
    return res.data;
  } catch {
    return makeDemoUrlsResponse(
      params.page,
      params.limit,
      params.folderId,
      params.search,
      params.expired,
      params.hasClicks
    );
  }
}

export async function createFolder(name: string): Promise<void> {
  if (isGuestSession()) return;
  await api.post('/folders', { name });
}

export async function bulkImport(rows: { url: string; customAlias?: string; expiresAt?: string }[]): Promise<BulkImportResult> {
  if (isGuestSession()) {
    return {
      created: rows.map((row, index) => ({
        id: `demo-created-${Date.now()}-${index}`,
        shortUrl: `${BASE_URL}/${row.customAlias?.trim() || `demo${index + 1}`}`,
        originalUrl: row.url,
        shortCode: row.customAlias?.trim() || `demo${index + 1}`
      })),
      errors: []
    };
  }
  const res = await api.post<BulkImportResult>('/url/bulk', {
    rows: rows.map((r) => ({
      url: r.url,
      customAlias: r.customAlias,
      expiresAt: r.expiresAt
    }))
  });
  return res.data;
}

export async function shortenUrl(params: ShortenParams): Promise<ShortenResult> {
  if (isGuestSession()) {
    const code = params.customAlias?.trim() || `demo${Math.random().toString(36).slice(2, 8)}`;
    return { shortUrl: `${BASE_URL}/${code}` };
  }
  const res = await api.post<ShortenResult>('/url/shorten', {
    url: params.url,
    customAlias: params.customAlias || undefined,
    expiresAt: params.expiresAt || undefined,
    folderId: params.folderId || undefined
  });
  return res.data;
}

export async function deleteUrl(id: string): Promise<void> {
  if (isGuestSession()) return;
  await api.delete(`/url/${id}`);
}

export interface UpdateUrlParams {
  originalUrl?: string;
  customAlias?: string | null;
  expiresAt?: string | null;
  folderId?: string | null;
}

export async function updateUrl(id: string, params: UpdateUrlParams): Promise<void> {
  if (isGuestSession()) return;
  await api.patch(`/url/${id}`, params);
}
