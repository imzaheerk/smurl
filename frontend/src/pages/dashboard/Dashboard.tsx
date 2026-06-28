import { UrlForm } from '../../components/UrlForm';
import { UrlTable } from '../../components/UrlTable';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { Dialog } from '@headlessui/react';
import {
  Link2,
  BarChart3,
  TrendingUp,
  FolderPlus,
  Search,
  Upload,
  Sparkles,
  Filter,
  FolderOpen,
  Zap
} from 'lucide-react';
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
      {loading && initialLoad ? (
        <div className="flex items-center justify-center py-28">
          <div className="text-center">
            <div className="relative mx-auto mb-5 h-12 w-12">
              <div
                className="absolute inset-0 animate-ping rounded-full bg-fuchsia-500/20"
                aria-hidden
              />
              <div
                className="relative h-12 w-12 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400"
                aria-hidden
              />
            </div>
            <p className="text-sm font-medium text-violet-200/60">Loading your workspace…</p>
          </div>
        </div>
      ) : (
        <div className="min-w-0 space-y-6 md:space-y-8">
          <DashboardHero
            pageCount={data.length}
            totalLinks={total}
            totalClicks={totalClicks}
            page={page}
            totalPages={totalPages}
          />

          <div className="grid min-w-0 gap-6 lg:grid-cols-12 lg:gap-8">
            <aside className="min-w-0 lg:col-span-4 lg:sticky lg:top-24 lg:self-start">
              <section className="relative overflow-hidden rounded-2xl border border-fuchsia-500/20 bg-[#0c0818]/90 shadow-[0_20px_60px_rgba(0,0,0,0.35),0_0_48px_rgba(232,121,249,0.06)]">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-500/10 blur-3xl"
                  aria-hidden
                />
                <div
                  className="pointer-events-none absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-amber-500/8 blur-3xl"
                  aria-hidden
                />

                <div className="relative border-b border-white/[0.06] px-5 py-4 sm:px-6 sm:py-5">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-gradient-to-br from-fuchsia-500/20 to-pink-500/10 shadow-[0_0_24px_rgba(232,121,249,0.15)]">
                      <Zap className="h-5 w-5 text-fuchsia-300" aria-hidden />
                    </span>
                    <div>
                      <h2 className="text-base font-semibold text-white sm:text-lg">Create link</h2>
                      <p className="mt-0.5 text-xs leading-relaxed text-violet-200/50 sm:text-sm">
                        Shorten a URL with custom code, expiry, or folder.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative px-5 py-4 sm:px-6 sm:py-5">
                  <UrlForm onCreated={fetchUrls} folders={folders} compact />
                </div>
              </section>
            </aside>

            <div className="min-w-0 space-y-5 lg:col-span-8 lg:space-y-6">
              <section className={APP_CARD + ' overflow-hidden p-0'}>
                <div className="border-b border-white/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-fuchsia-400/70" aria-hidden />
                    <h2 className="text-sm font-semibold text-white">Find & filter</h2>
                  </div>
                </div>

                <div className="space-y-4 px-4 py-4 sm:px-5 sm:py-5">
                  <form onSubmit={(e) => e.preventDefault()} className="relative">
                    <Search
                      className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-fuchsia-400/50"
                      aria-hidden
                    />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="Search by short code or destination URL…"
                      className={
                        APP_INPUT +
                        ' border-fuchsia-500/10 bg-[#0a0514]/80 pl-10 focus:border-fuchsia-400/40 focus:ring-fuchsia-500/30'
                      }
                    />
                  </form>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FilterGroup label="Status">
                      {(['all', 'active', 'expired'] as const).map((v) => (
                        <Button
                          key={v}
                          variant="tab"
                          active={filterExpired === v}
                          onClick={() => setFilterExpired(v)}
                        >
                          {v === 'all' ? 'All' : v === 'active' ? 'Active' : 'Expired'}
                        </Button>
                      ))}
                    </FilterGroup>
                    <FilterGroup label="Engagement">
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
                    </FilterGroup>
                  </div>
                </div>
              </section>

              <section className={APP_CARD + ' overflow-hidden p-0'}>
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 py-3.5 sm:px-5 sm:py-4">
                  <FolderOpen className="h-4 w-4 text-amber-400/70" aria-hidden />
                  <h2 className="text-sm font-semibold text-white">Folders</h2>
                </div>

                <div className="px-4 py-4 sm:px-5 sm:py-5">
                  <div className="-mx-1 overflow-x-auto pb-1">
                    <div className="flex min-w-max gap-2 px-1">
                      <FolderChip
                        active={selectedFolderId === null}
                        onClick={() => setSelectedFolderId(null)}
                        label="All links"
                        count={total}
                      />
                      {folders.map((f) => (
                        <FolderChip
                          key={f.id}
                          active={selectedFolderId === f.id}
                          onClick={() => setSelectedFolderId(f.id)}
                          label={f.name}
                          count={f.linkCount}
                        />
                      ))}
                    </div>
                  </div>

                  <form
                    onSubmit={handleAddFolder}
                    className="mt-4 flex flex-col gap-2 rounded-xl border border-dashed border-white/[0.08] bg-[#0a0514]/40 p-3 sm:flex-row sm:items-center"
                  >
                    <input
                      type="text"
                      value={newFolderName}
                      onChange={(e) => setNewFolderName(e.target.value)}
                      placeholder="Name a new folder…"
                      className={APP_INPUT + ' flex-1 min-w-0 border-white/[0.06] bg-transparent'}
                    />
                    <Button
                      type="submit"
                      variant="primaryViolet"
                      disabled={addingFolder}
                      className="shrink-0 gap-1.5 rounded-xl"
                    >
                      <FolderPlus className="h-4 w-4" />
                      {addingFolder ? 'Adding…' : 'Create folder'}
                    </Button>
                  </form>
                </div>
              </section>

              <section className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0818]/70 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent"
                  aria-hidden
                />

                <div className="flex flex-col gap-3 border-b border-white/[0.06] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10">
                      <Link2 className="h-4 w-4 text-fuchsia-300" aria-hidden />
                    </span>
                    <div>
                      <h2 className="flex items-center gap-2 text-sm font-semibold text-white sm:text-base">
                        Your links
                        {loading && !initialLoad && (
                          <span
                            className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/10 border-t-fuchsia-400"
                            aria-hidden
                          />
                        )}
                      </h2>
                      <p className="text-xs text-violet-400/50">
                        {total} link{total !== 1 ? 's' : ''} in your library
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
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
                      className="gap-1.5 rounded-xl px-3.5 py-2 text-xs"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      {importLoading ? 'Importing…' : 'Import CSV'}
                    </Button>
                  </div>
                </div>

                <UrlTable data={data} refetch={fetchUrls} folders={folders} />

                <div className="flex flex-col gap-3 border-t border-white/[0.06] bg-[#0a0514]/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                  <p className="order-2 text-xs text-violet-200/45 sm:order-1" aria-live="polite">
                    Page {page} of {totalPages}
                  </p>
                  <div className="order-1 flex gap-2 sm:order-2">
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="flex-1 rounded-xl disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
                    >
                      ← Previous
                    </Button>
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="flex-1 rounded-xl disabled:cursor-not-allowed disabled:opacity-40 sm:flex-none"
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

      <ImportResultModal
        open={importResult !== null}
        onClose={() => setImportResult(null)}
        importResult={importResult}
      />
    </Layout>
  );
};

function DashboardHero({
  pageCount,
  totalLinks,
  totalClicks,
  page,
  totalPages
}: {
  pageCount: number;
  totalLinks: number;
  totalClicks: number;
  page: number;
  totalPages: number;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0818]/80 shadow-[0_24px_80px_rgba(0,0,0,0.4)] backdrop-blur-xl">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-fuchsia-600/15 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-amber-500/10 blur-[70px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/[0.04] via-transparent to-amber-500/[0.03]"
        aria-hidden
      />

      <div className="relative px-5 py-6 sm:px-8 sm:py-8">
        <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-xl">
            <p className={LANDING_SECTION_LABEL}>Workspace</p>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
              Link{' '}
              <span className="bg-gradient-to-r from-fuchsia-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                dashboard
              </span>
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-violet-200/55 sm:text-base">
              Create short links, track clicks, and organize campaigns — all in one place.
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1.5 text-xs text-fuchsia-200/90">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden />
              Ready to shorten your next link
            </div>
          </div>

          <div className="grid w-full min-w-0 grid-cols-1 gap-2 min-[420px]:grid-cols-3 sm:gap-3 lg:w-auto lg:min-w-[420px] lg:shrink-0">
            <HeroStat
              icon={<Link2 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />}
              label="On page"
              value={pageCount}
              sub={`${totalLinks} total`}
              accent="fuchsia"
            />
            <HeroStat
              icon={<TrendingUp className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />}
              label="Clicks"
              value={totalClicks}
              sub="All time"
              accent="amber"
            />
            <HeroStat
              icon={<BarChart3 className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />}
              label="Page"
              value={page}
              sub={`of ${totalPages}`}
              accent="violet"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroStat({
  icon,
  label,
  value,
  sub,
  accent
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  sub: string;
  accent: 'fuchsia' | 'amber' | 'violet';
}) {
  const styles = {
    fuchsia: {
      ring: 'border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300',
      glow: 'shadow-[0_0_20px_rgba(232,121,249,0.12)]'
    },
    amber: {
      ring: 'border-amber-500/25 bg-amber-500/10 text-amber-300',
      glow: 'shadow-[0_0_20px_rgba(251,191,36,0.1)]'
    },
    violet: {
      ring: 'border-violet-500/25 bg-violet-500/10 text-violet-300',
      glow: 'shadow-[0_0_20px_rgba(167,139,250,0.1)]'
    }
  }[accent];

  return (
    <div
      className={
        'rounded-2xl border border-white/[0.08] bg-[#0a0514]/60 p-3 backdrop-blur-sm sm:p-4 ' +
        styles.glow
      }
    >
      <div
        className={
          'mb-2.5 flex h-8 w-8 items-center justify-center rounded-lg border sm:h-9 sm:w-9 ' +
          styles.ring
        }
      >
        {icon}
      </div>
      <p className="truncate text-[10px] font-semibold uppercase tracking-wider text-violet-400/50 sm:text-[11px]">
        {label}
      </p>
      <p className="mt-0.5 text-xl font-bold tabular-nums text-white sm:text-2xl">{value}</p>
      <p className="mt-0.5 truncate text-[10px] text-violet-400/40 sm:text-xs">{sub}</p>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-[#0a0514]/50 p-2.5">
      <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-violet-400/45">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FolderChip({
  active,
  onClick,
  label,
  count
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        'inline-flex shrink-0 items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition touch-manipulation ' +
        (active
          ? 'border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-200 shadow-[0_0_20px_rgba(232,121,249,0.12)]'
          : 'border-white/[0.08] bg-white/[0.03] text-violet-200/60 hover:border-fuchsia-500/20 hover:bg-white/[0.05] hover:text-violet-100')
      }
    >
      <FolderOpen className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
      <span className="max-w-[120px] truncate">{label}</span>
      <span
        className={
          'rounded-md px-1.5 py-0.5 text-[10px] tabular-nums ' +
          (active ? 'bg-fuchsia-500/20 text-fuchsia-200' : 'bg-white/[0.06] text-violet-400/60')
        }
      >
        {count}
      </span>
    </button>
  );
}

function ImportResultModal({
  open,
  onClose,
  importResult
}: {
  open: boolean;
  onClose: () => void;
  importResult: {
    created: { id: string; shortUrl: string; originalUrl: string }[];
    errors: { row: number; url?: string; message: string }[];
  } | null;
}) {
  return (
    <Dialog open={open} onClose={onClose} className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
      <Dialog.Panel className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-fuchsia-500/20 border-b-0 bg-[#0c0818] shadow-2xl sm:rounded-2xl sm:border-b">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
          aria-hidden
        />
        <div className="flex shrink-0 items-center justify-between border-b border-white/[0.06] px-5 py-4">
          <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-white">
            <Upload className="h-4 w-4 text-fuchsia-400" />
            Import results
          </Dialog.Title>
          <Button type="button" variant="ghost" onClick={onClose} aria-label="Close">
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
          <Button type="button" variant="primaryViolet" fullWidth onClick={onClose} className="rounded-xl">
            Done
          </Button>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
