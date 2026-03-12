import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface AnalyticsRecord {
  id: string;
  country?: string;
  browser?: string;
  referrer?: string;
  createdAt: string;
}

interface UrlInfo {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

interface AnalyticsResponse {
  url: UrlInfo;
  records: AnalyticsRecord[];
}

const CHART_COLORS = ['#22d3ee', '#a78bfa', '#34d399', '#f472b6', '#fbbf24', '#60a5fa'];

export const Analytics = () => {
  useAuth(true);
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await api.get<AnalyticsResponse>(`/url/${id}/analytics`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    void fetchData();
  }, [id]);

  const countryData = Object.values(
    (data?.records ?? []).reduce<Record<string, { name: string; value: number }>>(
      (acc, record) => {
        const key = record.country || 'Unknown';
        if (!acc[key]) acc[key] = { name: key, value: 0 };
        acc[key]!.value += 1;
        return acc;
      },
      {}
    )
  );

  const browserData = Object.values(
    (data?.records ?? []).reduce<Record<string, { name: string; value: number }>>(
      (acc, record) => {
        const key = record.browser || 'Unknown';
        if (!acc[key]) acc[key] = { name: key, value: 0 };
        acc[key]!.value += 1;
        return acc;
      },
      {}
    )
  );

  const shortUrl = data ? `http://localhost:5000/${data.url.shortCode}` : '';

  const tooltipStyle = {
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    padding: '12px 16px',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    fontSize: '13px',
    color: '#e2e8f0'
  };

  return (
    <Layout>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-500/12 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-violet-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="space-y-8 md:space-y-10">
        {/* Back + Hero */}
        <section className="relative opacity-0 animate-enter">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-cyan-300 mb-6 transition-colors"
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center">←</span>
            Back to Dashboard
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Analytics
            </span>
          </h1>
          {data && (
            <p className="mt-3 text-slate-400 flex flex-wrap items-center gap-2">
              <span>For</span>
              <a
                href={shortUrl}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-cyan-400 hover:text-cyan-300 hover:underline"
              >
                {shortUrl}
              </a>
            </p>
          )}
        </section>

        {loading && (
          <div className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-slate-900/50 border border-white/10 opacity-0 animate-enter-2">
            <span className="h-3 w-3 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-slate-400 font-medium">Loading analytics...</span>
          </div>
        )}

        {data && !loading && (
          <>
            {/* Stat cards */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
              <div className="relative opacity-0 animate-enter-2 group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/50 via-transparent to-teal-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/90">Total clicks</p>
                  <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">{data.url.clickCount}</p>
                  <p className="mt-1 text-sm text-slate-500">All time</p>
                </div>
              </div>

              <div className="relative opacity-0 animate-enter-3 group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-fuchsia-500/40 via-transparent to-cyan-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-magenta hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400/90">Countries</p>
                  <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">{countryData.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Unique locations</p>
                </div>
              </div>

              <div className="relative opacity-0 animate-enter-4 group">
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-violet-500/40 via-transparent to-fuchsia-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
                <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-teal hover:-translate-y-0.5 transition-all duration-300">
                  <p className="text-xs font-semibold uppercase tracking-widest text-violet-400/90">Browsers</p>
                  <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">{browserData.length}</p>
                  <p className="mt-1 text-sm text-slate-500">Unique browsers</p>
                </div>
              </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="relative opacity-0 animate-enter-3">
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-cyan-500/20 via-transparent to-teal-500/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 shadow-card overflow-hidden">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-teal-500" />
                    Clicks by country
                  </h2>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={countryData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v.toString()}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          cursor={{ fill: 'rgba(34, 211, 238, 0.08)' }}
                          formatter={(value: number) => [value, 'Clicks']}
                          labelFormatter={(label) => `Country: ${label}`}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                          {countryData.map((_, index) => (
                            <Cell key={index} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="relative opacity-0 animate-enter-4">
                <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-fuchsia-500/20 via-transparent to-violet-500/20 rounded-3xl blur-xl opacity-50" />
                <div className="relative rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl p-6 shadow-card overflow-hidden">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-violet-500" />
                    Clicks by browser
                  </h2>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={browserData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                        <XAxis
                          dataKey="name"
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#64748b"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(v) => v.toString()}
                        />
                        <Tooltip
                          contentStyle={tooltipStyle}
                          cursor={{ fill: 'rgba(232, 121, 249, 0.08)' }}
                          formatter={(value: number) => [value, 'Clicks']}
                          labelFormatter={(label) => `Browser: ${label}`}
                        />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]} maxBarSize={48}>
                          {browserData.map((_, index) => (
                            <Cell key={index} fill={CHART_COLORS[(index + 2) % CHART_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </section>

            {/* Recent clicks table */}
            <section className="relative opacity-0 animate-enter-5">
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-slate-600/10 via-transparent to-fuchsia-500/15 rounded-3xl blur-xl opacity-50" />
              <div className="relative rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-card">
                <div className="px-6 py-5 border-b border-white/10">
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-violet-400 to-fuchsia-500" />
                    Recent clicks
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/[0.02]">
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Time</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Country</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Browser</th>
                        <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Referrer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.records.slice(0, 15).map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                        >
                          <td className="px-5 py-4 text-slate-400 text-xs">
                            {new Date(r.createdAt).toLocaleString()}
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-medium">
                              {r.country ?? 'Unknown'}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-fuchsia-500/10 text-fuchsia-300 font-medium">
                              {r.browser ?? 'Unknown'}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-400 truncate max-w-[200px]" title={r.referrer ?? 'Direct'}>
                            {r.referrer ?? 'Direct / none'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {data.records.length === 0 && (
                  <div className="px-5 py-16 text-center text-slate-500">
                    <p className="font-medium">No clicks yet</p>
                    <p className="text-sm mt-1">Clicks will appear here once someone uses your link.</p>
                  </div>
                )}
                {data.records.length > 15 && (
                  <div className="px-5 py-3 border-t border-white/5 text-center text-xs text-slate-500">
                    Showing latest 15 of {data.records.length} clicks
                  </div>
                )}
              </div>
            </section>
          </>
        )}

        {!data && !loading && id && (
          <div className="rounded-3xl bg-slate-900/40 border border-white/10 p-12 text-center opacity-0 animate-enter-2">
            <p className="text-slate-400 font-medium">Could not load analytics for this link.</p>
            <Link to="/dashboard" className="mt-4 inline-block text-cyan-400 hover:text-cyan-300 font-semibold">
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};
