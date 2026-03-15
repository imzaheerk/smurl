import api from '../api';

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
  const res = await api.get<FolderOption[]>('/folders');
  return res.data;
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
  const res = await api.get<UrlResponse>('/url/my-urls', { params });
  return res.data;
}

export async function createFolder(name: string): Promise<void> {
  await api.post('/folders', { name });
}

export async function bulkImport(rows: { url: string; customAlias?: string; expiresAt?: string }[]): Promise<BulkImportResult> {
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
  const res = await api.post<ShortenResult>('/url/shorten', {
    url: params.url,
    customAlias: params.customAlias || undefined,
    expiresAt: params.expiresAt || undefined,
    folderId: params.folderId || undefined
  });
  return res.data;
}

export async function deleteUrl(id: string): Promise<void> {
  await api.delete(`/url/${id}`);
}
