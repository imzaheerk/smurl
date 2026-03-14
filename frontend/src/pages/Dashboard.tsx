import { useCallback, useEffect, useRef, useState } from 'react';
import { UrlForm, type FolderOption } from '../components/UrlForm';
import { UrlTable } from '../components/UrlTable';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import { Plus, Link2, BarChart3, TrendingUp, Globe, Zap, FolderPlus, Search, Upload } from 'lucide-react';
import api from '../services/api';

function parseCSV(csvText: string): { url: string; customAlias?: string; expiresAt?: string }[] {
  const rows: { url: string; customAlias?: string; expiresAt?: string }[] = [];
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

interface UrlItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  folderId?: string | null;
  folder?: { id: string; name: string } | null;
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
  const [initialLoad, setInitialLoad] = useState(true);
  const [folders, setFolders] = useState<FolderOption[]>([]);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [addingFolder, setAddingFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState(''); // debounced into searchQuery
  const [filterExpired, setFilterExpired] = useState<'all' | 'active' | 'expired'>('all');
  const [filterHasClicks, setFilterHasClicks] = useState<'all' | 'yes' | 'no'>('all');
  const [importResult, setImportResult] = useState<{
    created: { id: string; shortUrl: string; originalUrl: string; shortCode: string }[];
    errors: { row: number; url?: string; message: string }[];
  } | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFolders = useCallback(async () => {
    try {
      const res = await api.get<FolderOption[]>('/folders');
      setFolders(res.data);
    } catch {
      // non-blocking
    }
  }, []);

  const fetchUrls = useCallback(async () => {
    setLoading(true);
    try {
      const params: {
        page: number;
        limit: number;
        folderId?: string;
        search?: string;
        expired?: boolean;
        hasClicks?: boolean;
      } = { page, limit };
      if (selectedFolderId) params.folderId = selectedFolderId;
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterExpired === 'active') params.expired = false;
      if (filterExpired === 'expired') params.expired = true;
      if (filterHasClicks === 'yes') params.hasClicks = true;
      if (filterHasClicks === 'no') params.hasClicks = false;
      const res = await api.get<UrlResponse>('/url/my-urls', { params });
      setData(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load your links. Please try again.');
    } finally {
      setLoading(false);
      setInitialLoad(false);
    }
  }, [page, limit, selectedFolderId, searchQuery, filterExpired, filterHasClicks]);

  useEffect(() => {
    void fetchFolders();
  }, [fetchFolders]);

  useEffect(() => {
    void fetchUrls();
  }, [fetchUrls]);

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [selectedFolderId, searchQuery, filterExpired, filterHasClicks]);

  const handleAddFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newFolderName.trim();
    if (!name) return;
    setAddingFolder(true);
    try {
      await api.post('/folders', { name });
      toast.success(`Folder "${name}" created`);
      setNewFolderName('');
      await fetchFolders();
    } catch (err: unknown) {
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Failed to create folder';
      toast.error(msg ?? 'Failed to create folder');
    } finally {
      setAddingFolder(false);
    }
  };

  const handleImportCSV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setImportLoading(true);
    setImportResult(null);
    try {
      const text = await file.text();
      const rows = parseCSV(text);
      if (rows.length === 0) {
        toast.error('No valid rows in CSV. Use format: long_url[, custom_slug[, expires_at]]');
        setImportLoading(false);
        return;
      }
      if (rows.length > 100) {
        toast.error('Maximum 100 rows per import. Your file has ' + rows.length);
        setImportLoading(false);
        return;
      }
      const res = await api.post<{ created: { id: string; shortUrl: string; originalUrl: string; shortCode: string }[]; errors: { row: number; url?: string; message: string }[] }>('/url/bulk', {
        rows: rows.map((r) => ({
          url: r.url,
          customAlias: r.customAlias,
          expiresAt: r.expiresAt
        }))
      });
      setImportResult(res.data);
      await fetchUrls();
      toast.success(`Imported ${res.data.created.length} link(s). ${res.data.errors.length} error(s).`);
    } catch (err: unknown) {
      console.error(err);
      const msg = err && typeof err === 'object' && 'response' in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Import failed';
      toast.error(msg ?? 'Import failed');
    } finally {
      setImportLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const totalClicks = data.reduce((sum, u) => sum + u.clickCount, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, -30, 0]
            }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -30, 0],
              y: [0, 30, 0]
            }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/3 left-1/2 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
          {/* Hero Section - compact on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 md:mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-4xl md:text-6xl font-bold text-white mb-2 md:mb-4 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-red-400 bg-clip-text text-transparent">
                  Your Dashboard
                </h1>
                <p className="text-slate-400 text-sm sm:text-lg max-w-xl">
                  Create short links, track performance, and understand your audience.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 rounded-xl text-sm font-semibold text-cyan-300 shrink-0"
              >
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                Welcome Back!
              </motion.div>
            </div>
          </motion.div>

          {loading && initialLoad && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center py-20"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-12 w-12 rounded-full border-4 border-slate-700 border-t-cyan-400 mx-auto mb-4"
                />
                <p className="text-slate-400 text-lg font-medium">Loading your dashboard...</p>
              </div>
            </motion.div>
          )}

          {(!loading || !initialLoad) && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 sm:space-y-8"
            >
              {/* Stats Cards - compact row on mobile */}
              <motion.div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6">
                <MetricCard
                  icon={<Link2 className="w-6 h-6" />}
                  label="URLs This Page"
                  value={data.length}
                  subtitle={`${total} total in account`}
                  color="from-cyan-500 to-blue-500"
                  delay={0}
                />
                <MetricCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="Total Clicks"
                  value={totalClicks}
                  subtitle="Live count"
                  color="from-fuchsia-500 to-pink-500"
                  delay={0.1}
                />
                <MetricCard
                  icon={<BarChart3 className="w-6 h-6" />}
                  label="Current Page"
                  value={page}
                  subtitle={`of ${totalPages} pages`}
                  color="from-red-500 to-orange-500"
                  delay={0.2}
                />
              </motion.div>

              {/* Search and filters - stacked on mobile */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') e.preventDefault();
                    }}
                    placeholder="Search short code or URL..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/40"
                  />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider w-full sm:w-auto">Status</span>
                    {(['all', 'active', 'expired'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setFilterExpired(v)}
                        className={`px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                          filterExpired === v
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {v === 'all' ? 'All' : v === 'active' ? 'Active' : 'Expired'}
                      </button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider w-full sm:w-auto">Clicks</span>
                    {(['all', 'yes', 'no'] as const).map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setFilterHasClicks(v)}
                        className={`px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all touch-manipulation ${
                          filterHasClicks === v
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {v === 'all' ? 'All' : v === 'yes' ? 'Has clicks' : 'No clicks'}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Folders - scrollable chips on mobile */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Folders</p>
                <div className="overflow-x-auto pb-2 -mx-1">
                  <div className="flex gap-2 min-w-max">
                    <button
                      type="button"
                      onClick={() => setSelectedFolderId(null)}
                      className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                        selectedFolderId === null
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                          : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      All
                    </button>
                    {folders.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFolderId(f.id)}
                        className={`shrink-0 px-3 py-2 rounded-lg text-sm font-medium transition-all touch-manipulation ${
                          selectedFolderId === f.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                            : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                        }`}
                      >
                        {f.name} ({f.linkCount})
                      </button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleAddFolder} className="flex flex-col sm:flex-row gap-2 mt-3">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className="flex-1 min-w-0 rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={addingFolder}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-500/30 disabled:opacity-50 touch-manipulation shrink-0"
                  >
                    <FolderPlus className="w-4 h-4" />
                    {addingFolder ? 'Adding…' : 'Add folder'}
                  </button>
                </form>
              </motion.div>

              {/* Create URL Section - compact on mobile */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:border-white/20 shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-lg shrink-0">
                    <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">Create New Short Link</h2>
                    <p className="text-slate-400 text-sm sm:text-base">Long URLs into trackable short links</p>
                  </div>
                </div>
                <UrlForm
                  onCreated={fetchUrls}
                  folders={folders}
                />
              </motion.div>

              {/* URLs Table / Cards */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span aria-hidden>🔗</span>
                    Your Short Links
                    {loading && !initialLoad && (
                      <span className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-cyan-400 animate-spin" aria-hidden />
                    )}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={handleImportCSV}
                      aria-label="Import CSV file"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={importLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-50 transition-all touch-manipulation"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {importLoading ? 'Importing…' : 'Import CSV'}
                    </button>
                    <span className="text-xs text-slate-500">
                      {total} link{total !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                <UrlTable
                  data={data}
                  refetch={fetchUrls}
                />
                {/* Pagination - stacked on mobile */}
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <p className="text-xs sm:text-sm text-slate-400 order-2 sm:order-1" aria-live="polite">
                    Page {page} of {totalPages} · {total} total
                  </p>
                  <div className="flex gap-2 order-1 sm:order-2">
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      aria-label="Previous page"
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 touch-manipulation"
                    >
                      ← Prev
                    </button>
                    <button
                      type="button"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      aria-label="Next page"
                      className="flex-1 sm:flex-none px-4 py-2.5 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 touch-manipulation"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Import CSV results modal */}
      <Dialog
        open={importResult !== null}
        onClose={() => setImportResult(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <Dialog.Panel className="relative max-w-2xl w-full max-h-[85vh] bg-slate-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
            <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2">
              <Upload className="w-5 h-5 text-cyan-400" />
              Import results
            </Dialog.Title>
            <button
              type="button"
              onClick={() => setImportResult(null)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="overflow-y-auto flex-1 p-6 space-y-6">
            {importResult && importResult.created.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-emerald-300 mb-2">
                  Created ({importResult.created.length})
                </h4>
                <div className="rounded-xl border border-white/10 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Short URL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Original</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {importResult.created.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.03]">
                          <td className="px-3 py-2 font-mono text-xs text-cyan-300 truncate max-w-[200px]" title={row.shortUrl}>
                            {row.shortUrl}
                          </td>
                          <td className="px-3 py-2 text-slate-400 text-xs truncate max-w-[220px]" title={row.originalUrl}>
                            {row.originalUrl}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {importResult && importResult.errors.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-red-300 mb-2">
                  Errors ({importResult.errors.length})
                </h4>
                <div className="rounded-xl border border-red-500/20 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-red-500/10">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Row</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">URL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {importResult.errors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.03]">
                          <td className="px-3 py-2 text-slate-300 text-xs">{err.row}</td>
                          <td className="px-3 py-2 text-slate-400 text-xs truncate max-w-[180px]" title={err.url}>
                            {err.url ?? '—'}
                          </td>
                          <td className="px-3 py-2 text-red-300 text-xs">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {importResult && importResult.created.length === 0 && importResult.errors.length === 0 && (
              <p className="text-slate-400 text-sm">No rows to import.</p>
            )}
          </div>
          <div className="px-6 py-4 border-t border-white/10 shrink-0">
            <button
              type="button"
              onClick={() => setImportResult(null)}
              className="w-full px-4 py-2 rounded-xl bg-cyan-600 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors"
            >
              Done
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Layout>
  );
};

function MetricCard({
  icon,
  label,
  value,
  subtitle,
  color,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  subtitle: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} p-0.5 group cursor-pointer`}
    >
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-3 sm:p-6 backdrop-blur-xl">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl"
          style={{
            background: `linear-gradient(135deg, transparent, rgba(255,255,255,0.05))`,
          }}
        />
        <div className="relative text-white/30 mb-2 sm:mb-4 w-fit">
          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} p-1.5 sm:p-2.5 text-white shadow-lg flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <p className="text-[10px] sm:text-sm font-medium text-slate-400 mb-0.5 sm:mb-2 truncate" title={label}>{label}</p>
        <p className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent tabular-nums`}>
          {value}
        </p>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate" title={subtitle}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
