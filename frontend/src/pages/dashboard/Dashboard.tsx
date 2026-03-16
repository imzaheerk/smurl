import { UrlForm } from '../../components/UrlForm';
import { UrlTable } from '../../components/UrlTable';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Dialog } from '@headlessui/react';
import { Plus, Link2, BarChart3, TrendingUp, Zap, FolderPlus, Search, Upload } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';

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

export const Dashboard = () => {
  useAuth(true);
  const {
    data,
    page,
    setPage,
    limit,
    total,
    loading,
    initialLoad,
    folders,
    selectedFolderId,
    setSelectedFolderId,
    newFolderName,
    setNewFolderName,
    addingFolder,
    searchInput,
    setSearchInput,
    filterExpired,
    setFilterExpired,
    filterHasClicks,
    setFilterHasClicks,
    importResult,
    setImportResult,
    importLoading,
    fileInputRef,
    fetchUrls,
    handleAddFolder,
    handleImportCSV,
    totalPages,
    totalClicks
  } = useDashboard();

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
          <motion.div
            className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl"
            animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl"
            animate={{ x: [0, -30, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-1/3 left-1/2 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-12 relative z-10">
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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center justify-center py-20">
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
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-5 sm:space-y-8">
              <motion.div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6">
                <MetricCard icon={<Link2 className="w-6 h-6" />} label="URLs This Page" value={data.length} subtitle={`${total} total in account`} color="from-cyan-500 to-blue-500" delay={0} />
                <MetricCard icon={<TrendingUp className="w-6 h-6" />} label="Total Clicks" value={totalClicks} subtitle="Live count" color="from-fuchsia-500 to-pink-500" delay={0.1} />
                <MetricCard icon={<BarChart3 className="w-6 h-6" />} label="Current Page" value={page} subtitle={`of ${totalPages} pages`} color="from-red-500 to-orange-500" delay={0.2} />
              </motion.div>

              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <form onSubmit={(e) => e.preventDefault()} className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search short code or URL..."
                    className="w-full rounded-xl bg-white/5 border border-white/10 pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/40"
                  />
                </form>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider w-full sm:w-auto">Status</span>
                    {(['all', 'active', 'expired'] as const).map((v) => (
                      <Button key={v} variant="tab" active={filterExpired === v} onClick={() => setFilterExpired(v)}>
                        {v === 'all' ? 'All' : v === 'active' ? 'Active' : 'Expired'}
                      </Button>
                    ))}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-500 uppercase tracking-wider w-full sm:w-auto">Clicks</span>
                    {(['all', 'yes', 'no'] as const).map((v) => (
                      <Button key={v} type="button" variant="tab" active={filterHasClicks === v} onClick={() => setFilterHasClicks(v)} className="px-2.5 py-2 sm:px-3 sm:py-1.5 text-xs">
                        {v === 'all' ? 'All' : v === 'yes' ? 'Has clicks' : 'No clicks'}
                      </Button>
                    ))}
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Folders</p>
                <div className="overflow-x-auto pb-2 -mx-1">
                  <div className="flex gap-2 min-w-max">
                    <Button type="button" variant="tab" active={selectedFolderId === null} onClick={() => setSelectedFolderId(null)} className="shrink-0 px-3 py-2 text-sm">All</Button>
                    {folders.map((f) => (
                      <Button key={f.id} type="button" variant="tab" active={selectedFolderId === f.id} onClick={() => setSelectedFolderId(f.id)} className="shrink-0 px-3 py-2 text-sm">{f.name} ({f.linkCount})</Button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleAddFolder} className="flex flex-col sm:flex-row gap-2 mt-3">
                  <input type="text" value={newFolderName} onChange={(e) => setNewFolderName(e.target.value)} placeholder="New folder name" className="flex-1 min-w-0 rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50" />
                  <Button type="submit" variant="primaryViolet" disabled={addingFolder} className="shrink-0 gap-1.5">
                    <FolderPlus className="w-4 h-4" />{addingFolder ? 'Adding…' : 'Add folder'}
                  </Button>
                </form>
              </motion.div>

              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-8 hover:border-white/20 shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-lg shrink-0"><Plus className="w-5 h-5 sm:w-6 sm:h-6" /></div>
                  <div className="min-w-0">
                    <h2 className="text-lg sm:text-2xl font-bold text-white">Create New Short Link</h2>
                    <p className="text-slate-400 text-sm sm:text-base">Long URLs into trackable short links</p>
                  </div>
                </div>
                <UrlForm onCreated={fetchUrls} folders={folders} />
              </motion.div>

              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span aria-hidden>🔗</span> Your Short Links
                    {loading && !initialLoad && <span className="h-4 w-4 rounded-full border-2 border-slate-600 border-t-cyan-400 animate-spin" aria-hidden />}
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <input ref={fileInputRef} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImportCSV} aria-label="Import CSV file" />
                    <Button type="button" variant="secondaryCyan" onClick={() => fileInputRef.current?.click()} disabled={importLoading} className="px-3 py-2 text-xs">
                      <Upload className="w-3.5 h-3.5" />{importLoading ? 'Importing…' : 'Import CSV'}
                    </Button>
                    <span className="text-xs text-slate-500">{total} link{total !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <UrlTable data={data} refetch={fetchUrls} folders={folders} />
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <p className="text-xs sm:text-sm text-slate-400 order-2 sm:order-1" aria-live="polite">Page {page} of {totalPages} · {total} total</p>
                  <div className="flex gap-2 order-1 sm:order-2">
                    <Button type="button" variant="secondaryCyan" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} aria-label="Previous page" className="flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed">← Prev</Button>
                    <Button type="button" variant="secondaryCyan" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} aria-label="Next page" className="flex-1 sm:flex-none disabled:opacity-40 disabled:cursor-not-allowed">Next →</Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        <Dialog open={importResult !== null} onClose={() => setImportResult(null)} className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
          <Dialog.Panel className="relative max-w-2xl w-full max-h-[85vh] bg-slate-900 rounded-2xl shadow-xl border border-white/10 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between shrink-0">
              <Dialog.Title className="text-lg font-bold text-white flex items-center gap-2"><Upload className="w-5 h-5 text-cyan-400" /> Import results</Dialog.Title>
              <Button type="button" variant="ghost" onClick={() => setImportResult(null)} className="p-2" aria-label="Close">✕</Button>
            </div>
            <div className="overflow-y-auto flex-1 p-6 space-y-6">
              {importResult && importResult.created.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-emerald-300 mb-2">Created ({importResult.created.length})</h4>
                  <div className="rounded-xl border border-white/10 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-white/5"><tr><th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Short URL</th><th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Original</th></tr></thead>
                      <tbody className="divide-y divide-white/5">
                        {importResult.created.map((row) => (
                          <tr key={row.id} className="hover:bg-white/[0.03]">
                            <td className="px-3 py-2 font-mono text-xs text-cyan-300 truncate max-w-[200px]" title={row.shortUrl}>{row.shortUrl}</td>
                            <td className="px-3 py-2 text-slate-400 text-xs truncate max-w-[220px]" title={row.originalUrl}>{row.originalUrl}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {importResult && importResult.errors.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-red-300 mb-2">Errors ({importResult.errors.length})</h4>
                  <div className="rounded-xl border border-red-500/20 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-red-500/10"><tr><th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Row</th><th className="px-3 py-2 text-left text-xs font-medium text-slate-400">URL</th><th className="px-3 py-2 text-left text-xs font-medium text-slate-400">Message</th></tr></thead>
                      <tbody className="divide-y divide-white/5">
                        {importResult.errors.map((err, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.03]">
                            <td className="px-3 py-2 text-slate-300 text-xs">{err.row}</td>
                            <td className="px-3 py-2 text-slate-400 text-xs truncate max-w-[180px]" title={err.url}>{err.url ?? '—'}</td>
                            <td className="px-3 py-2 text-red-300 text-xs">{err.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {importResult && importResult.created.length === 0 && importResult.errors.length === 0 && <p className="text-slate-400 text-sm">No rows to import.</p>}
            </div>
            <div className="px-6 py-4 border-t border-white/10 shrink-0">
              <Button type="button" variant="primaryCyanSolid" fullWidth onClick={() => setImportResult(null)}>Done</Button>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </Layout>
  );
};

function MetricCard({ icon, label, value, subtitle, color, delay }: { icon: React.ReactNode; label: string; value: number; subtitle: string; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }} whileHover={{ y: -5, scale: 1.02 }} className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br ${color} p-0.5 group cursor-pointer`}>
      <div className="relative h-full rounded-xl sm:rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-3 sm:p-6 backdrop-blur-xl">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl sm:rounded-2xl" style={{ background: 'linear-gradient(135deg, transparent, rgba(255,255,255,0.05))' }} />
        <div className="relative text-white/30 mb-2 sm:mb-4 w-fit">
          <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} p-1.5 sm:p-2.5 text-white shadow-lg flex items-center justify-center`}>{icon}</div>
        </div>
        <p className="text-[10px] sm:text-sm font-medium text-slate-400 mb-0.5 sm:mb-2 truncate" title={label}>{label}</p>
        <p className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent tabular-nums`}>{value}</p>
        <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1 truncate" title={subtitle}>{subtitle}</p>
      </div>
    </motion.div>
  );
}
