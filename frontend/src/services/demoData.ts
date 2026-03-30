import type { AnalyticsRecord, AnalyticsResponse } from './Analytics/AnalyticsService';
import type { ApiKeyRow, CreateApiKeyResult, CustomDomainRow } from './Settings/SettingsService';
import type { FolderOption, UrlItem, UrlResponse } from './Dashboard/DashboardService';

const now = Date.now();

export const DEMO_FOLDERS: FolderOption[] = [
  { id: 'demo-folder-1', name: 'Marketing', linkCount: 2, totalClicks: 148 },
  { id: 'demo-folder-2', name: 'Careers', linkCount: 1, totalClicks: 36 },
  { id: 'demo-folder-3', name: 'Product', linkCount: 2, totalClicks: 201 }
];

export const DEMO_URLS: UrlItem[] = [
  {
    id: 'demo-url-1',
    shortCode: 'promo24',
    originalUrl: 'https://example.com/spring-campaign',
    clickCount: 92,
    createdAt: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(),
    folderId: 'demo-folder-1',
    folder: { id: 'demo-folder-1', name: 'Marketing' }
  },
  {
    id: 'demo-url-2',
    shortCode: 'docs-api',
    originalUrl: 'https://docs.example.com/api/getting-started',
    clickCount: 201,
    createdAt: new Date(now - 14 * 24 * 60 * 60 * 1000).toISOString(),
    folderId: 'demo-folder-3',
    folder: { id: 'demo-folder-3', name: 'Product' }
  },
  {
    id: 'demo-url-3',
    shortCode: 'hiring',
    originalUrl: 'https://example.com/careers/software-engineer',
    clickCount: 36,
    createdAt: new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString(),
    folderId: 'demo-folder-2',
    folder: { id: 'demo-folder-2', name: 'Careers' }
  },
  {
    id: 'demo-url-4',
    shortCode: 'waitlist',
    originalUrl: 'https://example.com/product/waitlist',
    clickCount: 56,
    createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    folderId: 'demo-folder-3',
    folder: { id: 'demo-folder-3', name: 'Product' }
  },
  {
    id: 'demo-url-5',
    shortCode: 'team-kit',
    originalUrl: 'https://example.com/press-kit',
    clickCount: 12,
    createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    folderId: 'demo-folder-1',
    folder: { id: 'demo-folder-1', name: 'Marketing' }
  }
];

export const DEMO_DOMAINS: CustomDomainRow[] = [
  { id: 'demo-domain-1', domain: 'go.example.com', verified: true, createdAt: new Date(now - 25 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'demo-domain-2', domain: 'links.example.org', verified: false, createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString() }
];

export const DEMO_API_KEYS: ApiKeyRow[] = [
  { id: 'demo-key-1', name: 'Recruiter demo key', keyPrefix: 'sm_live_demo', createdAt: new Date(now - 12 * 24 * 60 * 60 * 1000).toISOString() }
];

const DEMO_RECORDS_BY_URL: Record<string, AnalyticsRecord[]> = {
  'demo-url-1': [
    { id: 'r-1', country: 'India', browser: 'Chrome', referrer: 'linkedin.com', createdAt: new Date(now - 14 * 60 * 1000).toISOString() },
    { id: 'r-2', country: 'USA', browser: 'Safari', referrer: 'Direct', createdAt: new Date(now - 40 * 60 * 1000).toISOString() },
    { id: 'r-3', country: 'Germany', browser: 'Firefox', referrer: 'google.com', createdAt: new Date(now - 90 * 60 * 1000).toISOString() }
  ],
  'demo-url-2': [
    { id: 'r-4', country: 'India', browser: 'Chrome', referrer: 'docs.example.com', createdAt: new Date(now - 9 * 60 * 1000).toISOString() },
    { id: 'r-5', country: 'UK', browser: 'Edge', referrer: 'Direct', createdAt: new Date(now - 60 * 60 * 1000).toISOString() },
    { id: 'r-6', country: 'Brazil', browser: 'Chrome', referrer: 'x.com', createdAt: new Date(now - 3 * 60 * 60 * 1000).toISOString() }
  ]
};

export function makeDemoUrlsResponse(page: number, limit: number, folderId?: string, search?: string, expired?: boolean, hasClicks?: boolean): UrlResponse {
  let items = [...DEMO_URLS];
  if (folderId) items = items.filter((i) => i.folderId === folderId);
  if (search) {
    const q = search.toLowerCase();
    items = items.filter((i) => i.shortCode.toLowerCase().includes(q) || i.originalUrl.toLowerCase().includes(q));
  }
  if (expired === true) items = items.filter((i) => Boolean(i.expiresAt && new Date(i.expiresAt).getTime() < now));
  if (expired === false) items = items.filter((i) => !i.expiresAt || new Date(i.expiresAt).getTime() >= now);
  if (hasClicks === true) items = items.filter((i) => i.clickCount > 0);
  if (hasClicks === false) items = items.filter((i) => i.clickCount === 0);

  const start = (page - 1) * limit;
  const paged = items.slice(start, start + limit);
  return { items: paged, total: items.length, page, limit };
}

export function makeDemoAnalytics(id: string): AnalyticsResponse {
  const url = DEMO_URLS.find((u) => u.id === id) ?? DEMO_URLS[0];
  const records = DEMO_RECORDS_BY_URL[url.id] ?? [];
  return { url, records };
}

export function makeDemoCreatedKey(name: string): CreateApiKeyResult {
  const clean = name.trim() || 'Demo key';
  return {
    id: `demo-key-${Date.now()}`,
    name: clean,
    key: `sm_demo_${Math.random().toString(36).slice(2, 16)}`,
    keyPrefix: 'sm_demo',
    createdAt: new Date().toISOString()
  };
}
