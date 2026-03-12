import { useEffect, useState } from 'react';
import { UrlForm } from '../components/UrlForm';
import { UrlTable } from '../components/UrlTable';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';

interface UrlItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

interface UrlResponse {
  items: UrlItem[];
  total: number;
  page: number;
  limit: number;
}

export const Dashboard = () => {
  useAuth(true);
  const [data, setData] = useState<UrlItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchUrls = async () => {
    setLoading(true);
    try {
      const res = await api.get<UrlResponse>('/url/my-urls', { params: { page, limit } });
      setData(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const totalClicks = data.reduce((sum, u) => sum + u.clickCount, 0);

  return (
    <Layout>
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-fuchsia-500/12 rounded-full blur-[100px] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 left-1/2 w-[300px] h-[300px] bg-teal-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="space-y-8 md:space-y-10">
        {/* Hero */}
        <section className="relative opacity-0 animate-enter">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-slate-100 via-slate-200 to-slate-300 bg-clip-text text-transparent">
              Dashboard
            </span>
          </h1>
          <p className="mt-2 text-slate-400 text-lg max-w-xl">
            Create short links, track clicks, and understand your audience.
          </p>
        </section>

        {/* Bento stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          <div className="relative opacity-0 animate-enter-2 group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-cyan-500/50 via-transparent to-teal-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-cyan hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold uppercase tracking-widest text-cyan-400/90">URLs this page</p>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">{data.length}</p>
              <p className="mt-1 text-sm text-slate-500">{total} total in account</p>
            </div>
          </div>

          <div className="relative opacity-0 animate-enter-3 group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-fuchsia-500/40 via-transparent to-cyan-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-magenta hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold uppercase tracking-widest text-fuchsia-400/90">Total clicks</p>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">{totalClicks}</p>
              <p className="mt-1 text-sm text-slate-500">Live count</p>
            </div>
          </div>

          <div className="relative opacity-0 animate-enter-4 group">
            <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-500/40 via-transparent to-cyan-500/30 rounded-2xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-sm p-6 shadow-card hover:shadow-glow-teal hover:-translate-y-0.5 transition-all duration-300">
              <p className="text-xs font-semibold uppercase tracking-widest text-teal-400/90">Page</p>
              <p className="mt-2 text-3xl md:text-4xl font-bold text-white tabular-nums">
                {page} <span className="text-slate-500 font-normal">/ {totalPages}</span>
              </p>
              <p className="mt-1 text-sm text-slate-500">{limit} per page</p>
            </div>
          </div>
        </section>

        {/* Create short URL — glass card */}
        <section className="relative opacity-0 animate-enter-4">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-r from-cyan-500/30 via-fuchsia-500/20 to-teal-500/30 rounded-3xl blur-xl opacity-60" />
          <div className="relative rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-card">
            <div className="p-6 md:p-8">
              <UrlForm
                onCreated={() => {
                  setPage(1);
                  void fetchUrls();
                }}
              />
            </div>
          </div>
        </section>

        {/* Your URLs table */}
        <section className="relative opacity-0 animate-enter-5">
          <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-slate-600/20 via-transparent to-cyan-500/20 rounded-3xl blur-xl opacity-50" />
          <div className="relative rounded-3xl bg-slate-900/40 border border-white/10 backdrop-blur-xl overflow-hidden shadow-card">
            {loading && (
              <div className="px-6 py-4 border-b border-white/10 flex items-center gap-2 text-sm text-slate-400">
                <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                Loading URLs...
              </div>
            )}
            <UrlTable data={data} refetch={fetchUrls} />
          </div>
        </section>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <p className="text-sm text-slate-500">
            Page {page} of {totalPages} · {total} URLs total
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Previous
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:pointer-events-none transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
