import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

interface UrlItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
}

interface Props {
  data: UrlItem[];
  refetch: () => void;
}

export const UrlTable = ({ data, refetch }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this URL?')) return;
    setDeletingId(id);
    try {
      await api.delete(`/url/${id}`);
      refetch();
    } catch (err) {
      console.error(err);
      alert('Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  const copyShort = async (shortUrl: string) => {
    await navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-cyan-500" />
          Your URLs
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Short URL</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Original</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Clicks</th>
              <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Created</th>
              <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const shortUrl = `http://localhost:5000/${item.shortCode}`;
              return (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-xs truncate max-w-[180px] hover:underline"
                      >
                        {shortUrl}
                      </a>
                      <button
                        onClick={() => copyShort(shortUrl)}
                        className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-all"
                      >
                        Copy
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <span className="block truncate text-slate-400" title={item.originalUrl}>
                      {item.originalUrl}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold tabular-nums">
                      {item.clickCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/analytics/${item.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 transition-all"
                      >
                        Analytics
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                      >
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-slate-500"
                >
                  <p className="font-medium">No URLs yet</p>
                  <p className="text-sm mt-1">Create your first short link above.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
