import { useState } from 'react';
import api from '../services/api';

interface Props {
  onCreated: () => void;
}

export const UrlForm = ({ onCreated }: Props) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/url/shorten', {
        url,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined
      });
      setShortUrl(res.data.shortUrl);
      setUrl('');
      setCustomAlias('');
      setExpiresAt('');
      onCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-fuchsia-500" />
        Create Short URL
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">Destination URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Custom short code (optional)</label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-link"
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Expiration (optional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
              Creating...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-6 flex items-center gap-3 rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3">
          <span className="text-sm text-cyan-300 truncate flex-1 font-mono">{shortUrl}</span>
          <button
            onClick={copyToClipboard}
            className="shrink-0 px-4 py-2 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 transition-all"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
};
