import api from '../api';

// --- Types / Interfaces ---
export interface AnalyticsRecord {
  id: string;
  country?: string;
  browser?: string;
  referrer?: string;
  createdAt: string;
}

export interface AnalyticsUrlInfo {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  activeFrom?: string | null;
  activeTo?: string | null;
}

export interface AnalyticsResponse {
  url: AnalyticsUrlInfo;
  records: AnalyticsRecord[];
}

// --- API endpoints ---
const ANALYTICS_BY_ID = (id: string) => `/url/${id}/analytics` as const;
const URL_PATCH = (id: string) => `/url/${id}` as const;

// --- API functions ---
export async function getAnalytics(id: string): Promise<AnalyticsResponse> {
  const res = await api.get<AnalyticsResponse>(ANALYTICS_BY_ID(id));
  return res.data;
}

export async function updateUrlSchedule(
  id: string,
  activeFrom: string | null,
  activeTo: string | null
): Promise<void> {
  await api.patch(URL_PATCH(id), {
    activeFrom: activeFrom?.trim() || null,
    activeTo: activeTo?.trim() || null
  });
}

// --- Helpers ---
export function getScheduleStatus(
  activeFrom?: string | null,
  activeTo?: string | null
): 'always' | 'upcoming' | 'active' | 'ended' {
  const hasWindow = (activeFrom != null && activeFrom !== '') || (activeTo != null && activeTo !== '');
  if (!hasWindow) return 'always';
  const now = Date.now();
  const from = activeFrom ? new Date(activeFrom).getTime() : 0;
  const to = activeTo ? new Date(activeTo).getTime() : Infinity;
  if (from > 0 && now < from) return 'upcoming';
  if (to < Infinity && now > to) return 'ended';
  return 'active';
}

export function recordsToCSV(records: AnalyticsRecord[]): string {
  const header = 'Time,Country,Browser,Referrer';
  const escape = (v: string) => {
    const s = String(v ?? '');
    if (s.includes(',') || s.includes('"') || s.includes('\n')) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const rows = records.map(
    (r) =>
      [
        new Date(r.createdAt).toISOString(),
        escape(r.country ?? 'Unknown'),
        escape(r.browser ?? 'Unknown'),
        escape(r.referrer ?? 'Direct')
      ].join(',')
  );
  return [header, ...rows].join('\r\n');
}
