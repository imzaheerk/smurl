import { UrlForm } from '../../components/UrlForm';
import { UrlTable } from '../../components/UrlTable';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { Dialog } from '@headlessui/react';
import { Link2, BarChart3, TrendingUp, FolderPlus, Search, Upload } from 'lucide-react';
import { useDashboard } from './hooks/useDashboard';
import { APP_CARD, APP_INPUT, LANDING_SECTION_LABEL } from '../../components/app/appTheme';

export const Dashboard = () => {
  useAuth(true);
  const {
    data,
    page,
    setPage,
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
    total,
    totalClicks
  } = useDashboard();

  return (
    <Layout>
      <header className="mb-6 md:mb-8">
        <p className={LANDING_SECTION_LABEL}>Workspace</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
          Dashboard
        </h1>
        <p className="mt-1.5 max-w-xl text-sm text-violet-200/50 sm:text-base">
          Create short links, track performance, and organize campaigns.
        </p>
      </header>

      {loading && initialLoad ? (
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div
              className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400"
              aria-hidden
            />
            <p className="text-sm text-violet-200/50">Loading your links…</p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <StatCard
              icon={<Link2 className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="On this page"
              value={data.length}
              hint={`${total} total`}
              accent="fuchsia"
            />
            <StatCard
              icon={<TrendingUp className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Total clicks"
              value={totalClicks}
              hint="All time"
              accent="amber"
            />
            <StatCard
              icon={<BarChart3 className="h-4 w-4 sm:h-5 sm:w-5" />}
              label="Page"
              value={page}
              hint={`of ${totalPages}`}
              accent="violet"
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-12 lg:gap-6">
            <aside className="space-y-5 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <section className={APP_CARD + ' p-4 sm:p-5'}>
                <h2 className="text-sm font-semibold text-white">Create link</h2>
                <p className="mt-0.5 text-xs text-violet-200/45">Shorten a URL with optional alias & expiry.</p>
                <div className="mt-4">
                  <UrlForm onCreated={fetchUrls} folders={folders} compact />
                </div>
              </section>
            </aside>

            <div className="space-y-5 lg:col-span-8">
              <section className={APP_CARD + ' p-4 sm:p-5'}>
                <form onSubmit={(e) => e.preventDefault()} className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400/40"
                    aria-hidden
                  />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    placeholder="Search short code or URL…"
                    className={APP_INPUT + ' pl-9'}
                  />
                </form>

                <div className="mt-4 space-y-3">
                  <FilterRow label="Status">
                    {(['all', 'active', 'expired'] as const).map((v) => (
                      <Button key={v} variant="tab" active={filterExpired === v} onClick={() => setFilterExpired(v)}>
                        {v === 'all' ? 'All' : v === 'active' ? 'Active' : 'Expired'}
                      </Button>
                    ))}
                  </FilterRow>
                  <FilterRow label="Clicks">
                    {(['all', 'yes', 'no'] as const).map((v) => (
                      <Button
                        key={v}
                        type="button"
                        variant="tab"
                        active={filterHasClicks === v}
                        onClick={() => setFilterHasClicks(v)}
                      >
                        {v === 'all' ? 'All' : v === 'yes' ? 'Has clicks' : 'No clicks'}
                      </Button>
                    ))}
                  </FilterRow>
                </div>
              </section>

              <section className={APP_CARD + ' p-4 sm:p-5'}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-violet-400/45">Folders</p>
                <div className="-mx-1 mt-2 overflow-x-auto pb-1">
                  <div className="flex min-w-max gap-1.5">
                    <Button
                      type="button"
                      variant="tab"
                      active={selectedFolderId === null}
                      onClick={() => setSelectedFolderId(null)}
                    >
                      All
                    </Button>
                    {folders.map((f) => (
                      <Button
                        key={f.id}
                        type="button"
                        variant="tab"
                        active={selectedFolderId === f.id}
                        onClick={() => setSelectedFolderId(f.id)}
                      >
                        {f.name} ({f.linkCount})
                      </Button>
                    ))}
                  </div>
                </div>
                <form onSubmit={handleAddFolder} className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <input
                    type="text"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="New folder name"
                    className={APP_INPUT + ' flex-1 min-w-0'}
                  />
                  <Button type="submit" variant="primaryViolet" disabled={addingFolder} className="shrink-0 gap-1.5">
                    <FolderPlus className="h-4 w-4" />
                    {addingFolder ? 'Adding…' : 'Add'}
                  </Button>
                </form>
              </section>

              <section className={APP_CARD + ' overflow-hidden'}>
                <div className="flex flex-col gap-2 border-b border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                  <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                    Your links
                    {loading && !initialLoad && (
                      <span
                        className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400"
                        aria-hidden
                      />
                    )}
                  </h2>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv"
                      className="hidden"
                      onChange={handleImportCSV}
                      aria-label="Import CSV file"
                    />
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={importLoading}
                      className="gap-1.5 px-3 py-2 text-xs"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {importLoading ? 'Importing…' : 'Import CSV'}
                    </Button>
                    <span className="text-xs text-violet-400/45">
                      {total} link{total !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>

                <UrlTable data={data} refetch={fetchUrls} folders={folders} />

                <div className="flex flex-col gap-3 border-t border-white/[0.06] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
                  <p className="order-2 text-xs text-violet-200/45 sm:order-1" aria-live="polite">
                    Page {page} of {totalPages} · {total} total
                  </p>
                  <div className="order-1 flex gap-2 sm:order-2">
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex-1 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      ← Prev
                    </Button>
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex-1 disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      Next →
                    </Button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      <Dialog
        open={importResult !== null}
        onClose={() => setImportResult(null)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
        <Dialog.Panel className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0818] shadow-2xl">
          <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
            <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-white">
              <Upload className="h-4 w-4 text-fuchsia-400" />
              Import results
            </Dialog.Title>
            <Button type="button" variant="ghost" onClick={() => setImportResult(null)} aria-label="Close">
              ✕
            </Button>
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto p-5">
            {importResult && importResult.created.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-semibold text-emerald-300">
                  Created ({importResult.created.length})
                </h4>
                <div className="overflow-hidden rounded-xl border border-white/[0.06]">
                  <table className="w-full text-sm">
                    <thead className="bg-white/[0.03]">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-violet-200/50">Short URL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-violet-200/50">Original</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {importResult.created.map((row) => (
                        <tr key={row.id} className="hover:bg-white/[0.02]">
                          <td
                            className="max-w-[200px] truncate px-3 py-2 font-mono text-xs text-fuchsia-300"
                            title={row.shortUrl}
                          >
                            {row.shortUrl}
                          </td>
                          <td
                            className="max-w-[220px] truncate px-3 py-2 text-xs text-violet-200/50"
                            title={row.originalUrl}
                          >
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
                <h4 className="mb-2 text-sm font-semibold text-red-300">Errors ({importResult.errors.length})</h4>
                <div className="overflow-hidden rounded-xl border border-red-500/20">
                  <table className="w-full text-sm">
                    <thead className="bg-red-500/10">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-violet-200/50">Row</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-violet-200/50">URL</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-violet-200/50">Message</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {importResult.errors.map((err, idx) => (
                        <tr key={idx} className="hover:bg-white/[0.02]">
                          <td className="px-3 py-2 text-xs text-violet-200/70">{err.row}</td>
                          <td
                            className="max-w-[180px] truncate px-3 py-2 text-xs text-violet-200/50"
                            title={err.url}
                          >
                            {err.url ?? '—'}
                          </td>
                          <td className="px-3 py-2 text-xs text-red-300">{err.message}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {importResult && importResult.created.length === 0 && importResult.errors.length === 0 && (
              <p className="text-sm text-violet-200/50">No rows to import.</p>
            )}
          </div>
          <div className="shrink-0 border-t border-white/[0.06] p-5">
            <Button type="button" variant="primaryViolet" fullWidth onClick={() => setImportResult(null)}>
              Done
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </Layout>
  );
};

function StatCard({
  icon,
  label,
  value,
  hint,
  accent
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  hint: string;
  accent: 'fuchsia' | 'amber' | 'violet';
}) {
  const accentMap = {
    fuchsia: 'border-fuchsia-500/20 bg-fuchsia-500/10 text-fuchsia-300',
    amber: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    violet: 'border-violet-500/20 bg-violet-500/10 text-violet-300'
  };

  return (
    <div className={APP_CARD + ' p-3 sm:p-4'}>
      <div
        className={
          'mb-2 flex h-8 w-8 items-center justify-center rounded-lg border sm:h-9 sm:w-9 ' + accentMap[accent]
        }
      >
        {icon}
      </div>
      <p className="truncate text-[10px] font-medium uppercase tracking-wide text-violet-400/45 sm:text-xs">{label}</p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-white sm:text-2xl">{value}</p>
      <p className="mt-0.5 truncate text-[10px] text-violet-400/40 sm:text-xs">{hint}</p>
    </div>
  );
}

function FilterRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="w-full text-[11px] font-semibold uppercase tracking-wider text-violet-400/45 sm:mr-1 sm:w-auto">
        {label}
      </span>
      {children}
    </div>
  );
}
