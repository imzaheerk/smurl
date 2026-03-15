import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { motion } from 'framer-motion';
import { Layout } from '../../components/Layout';
import { BackLink, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { Dialog } from '@headlessui/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Globe, Monitor, ArrowLeft, TrendingUp, Download, Clock } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../../services/api';
import { ROUTES } from '../../constants/routes';
import type { AnalyticsRecord } from '../../services/Analytics/AnalyticsService';
import { getScheduleStatus, recordsToCSV } from '../../services/Analytics/AnalyticsService';
import { useAnalytics } from './hooks/useAnalytics';

function downloadCSV(records: AnalyticsRecord[], shortCode: string) {
  if (records.length === 0) {
    toast.error('No data to export');
    return;
  }
  const csv = recordsToCSV(records);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `smurl-analytics-${shortCode}-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  toast.success('CSV downloaded');
}

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

export const Analytics = () => {
  useAuth(true);
  const { id } = useParams<{ id: string }>();
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const {
    data,
    loading,
    error,
    scheduleActiveFrom,
    scheduleActiveTo,
    setScheduleActiveFrom,
    setScheduleActiveTo,
    handleSaveSchedule,
    scheduleSaving
  } = useAnalytics(id);
  const scheduleStatus = data ? getScheduleStatus(data.url.activeFrom, data.url.activeTo) : 'always';
  const shortUrl = data ? `${BASE_URL}/${data.url.shortCode}` : '';
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
          {/* Header - compact on mobile */}
          <div className="mb-6 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <BackLink to={ROUTES.DASHBOARD} theme="cyan">
                <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                Back to Dashboard
              </BackLink>
              {data && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="min-w-0">
                    <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-red-400 bg-clip-text text-transparent">
                      Analytics
                    </h1>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-cyan-400 hover:text-cyan-300 text-xs sm:text-sm group transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded break-all"
                    >
                      <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                      <span className="break-all">{BASE_URL.replace(/^https?:\/\//, '')}/{data.url.shortCode}</span>
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-end gap-3 shrink-0">
                    <div className="flex items-center justify-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 rounded-xl text-xs sm:text-sm font-semibold text-cyan-300">
                      <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
                      Active Link
                    </div>
                    {shortUrl && (
                      <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 border border-slate-700/80 px-3 py-3 w-full sm:w-auto sm:min-w-0">
                        <QRCodeCanvas
                          id="analytics-qr"
                          value={shortUrl}
                          size={56}
                          bgColor="#020617"
                          fgColor="#e5e7eb"
                        />
                        <div className="text-[10px] sm:text-[11px] text-slate-300 min-w-0 flex-1">
                          <p className="font-medium text-slate-100 mb-0.5">QR for this link</p>
                          <p className="text-slate-400">Scan to open on mobile.</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {loading && (
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
                <p className="text-slate-400 text-lg font-medium">Loading your analytics...</p>
              </div>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-red-500/20 bg-red-500/5 backdrop-blur-xl px-6 py-8 text-center"
            >
              <p className="text-red-300 font-medium mb-2">Something went wrong</p>
              <p className="text-slate-400 text-sm mb-4">{error}</p>
              <Link
                to={ROUTES.DASHBOARD}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white/10 border border-white/10 text-slate-200 hover:bg-white/15 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
            </motion.div>
          )}

          {data && !loading && !error && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-5 sm:space-y-8"
            >
              {/* Metrics Cards - compact on mobile like Dashboard */}
              <motion.div className="grid grid-cols-3 md:grid-cols-3 gap-2 sm:gap-6">
                <MetricCard
                  icon={<TrendingUp className="w-6 h-6" />}
                  label="Total Clicks"
                  value={data.url.clickCount}
                  color="from-cyan-500 to-blue-500"
                  delay={0}
                />
                <MetricCard
                  icon={<Globe className="w-6 h-6" />}
                  label="Countries"
                  value={Object.keys(
                    (data.records ?? []).reduce<Record<string, boolean>>(
                      (acc, record) => {
                        acc[record.country || 'Unknown'] = true;
                        return acc;
                      },
                      {}
                    )
                  ).length}
                  color="from-fuchsia-500 to-pink-500"
                  delay={0.1}
                />
                <MetricCard
                  icon={<Monitor className="w-6 h-6" />}
                  label="Browsers"
                  value={Object.keys(
                    (data.records ?? []).reduce<Record<string, boolean>>(
                      (acc, record) => {
                        acc[record.browser || 'Unknown'] = true;
                        return acc;
                      },
                      {}
                    )
                  ).length}
                  color="from-red-500 to-orange-500"
                  delay={0.2}
                />
              </motion.div>

              {/* Schedule / Active window */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-cyan-400" />
                  Schedule (activate / deactivate temporarily)
                </h3>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="text-sm text-slate-400">Status:</span>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold ${
                      scheduleStatus === 'always'
                        ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                        : scheduleStatus === 'active'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : scheduleStatus === 'upcoming'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-red-500/20 text-red-300 border border-red-500/40'
                    }`}
                  >
                    {scheduleStatus === 'always' && 'Always active'}
                    {scheduleStatus === 'active' && 'Active'}
                    {scheduleStatus === 'upcoming' && 'Upcoming'}
                    {scheduleStatus === 'ended' && 'Ended'}
                  </span>
                </div>
                <form onSubmit={handleSaveSchedule} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
                  <div>
                    <label htmlFor="schedule-from" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Active from (optional)
                    </label>
                    <input
                      id="schedule-from"
                      type="datetime-local"
                      value={scheduleActiveFrom}
                      onChange={(e) => setScheduleActiveFrom(e.target.value)}
                      onFocus={(e) => e.target.showPicker?.()}
                      className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="schedule-to" className="block text-xs font-medium text-slate-400 mb-1.5">
                      Active until (optional)
                    </label>
                    <input
                      id="schedule-to"
                      type="datetime-local"
                      value={scheduleActiveTo}
                      onChange={(e) => setScheduleActiveTo(e.target.value)}
                      onFocus={(e) => e.target.showPicker?.()}
                      className="w-full rounded-xl bg-slate-950 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => {
                        setScheduleActiveFrom('');
                        setScheduleActiveTo('');
                      }}
                      className="px-3 py-2.5"
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="primaryViolet"
                      disabled={scheduleSaving}
                    >
                      {scheduleSaving ? 'Saving…' : 'Save schedule'}
                    </Button>
                  </div>
                </form>
                <p className="mt-3 text-xs text-slate-500">
                  Leave both empty for always active. The short link will redirect only when the current time is within the window (404 outside).
                </p>
              </motion.div>

              {/* Charts Section - shorter height on mobile */}
              <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <ChartCard
                  title="Clicks by Country"
                  icon={<Globe className="w-4 h-4 sm:w-5 sm:h-5" />}
                  delay={0.3}
                >
                  <div className="h-56 sm:h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.values(
                          (data.records ?? []).reduce<Record<string, { name: string; value: number }>>(
                            (acc, record) => {
                              const key = record.country || 'Unknown';
                              if (!acc[key]) acc[key] = { name: key, value: 0 };
                              acc[key]!.value += 1;
                              return acc;
                            },
                            {}
                          )
                        )}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(34, 211, 238, 0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '12px',
                            color: '#e2e8f0'
                          }}
                          cursor={false}
                        />
                        <Bar dataKey="value" fill="url(#colorGradient1)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="colorGradient1" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>

                <ChartCard
                  title="Clicks by Browser"
                  icon={<Monitor className="w-5 h-5" />}
                  delay={0.4}
                >
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={Object.values(
                          (data.records ?? []).reduce<Record<string, { name: string; value: number }>>(
                            (acc, record) => {
                              const key = record.browser || 'Unknown';
                              if (!acc[key]) acc[key] = { name: key, value: 0 };
                              acc[key]!.value += 1;
                              return acc;
                            },
                            {}
                          )
                        )}
                        margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                        <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                        <YAxis stroke="#94a3b8" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(15, 23, 42, 0.9)',
                            border: '1px solid rgba(232, 121, 249, 0.3)',
                            borderRadius: '12px',
                            padding: '12px',
                            fontSize: '12px',
                            color: '#e2e8f0'
                          }}
                          cursor={false}
                        />
                        <Bar dataKey="value" fill="url(#colorGradient2)" radius={[8, 8, 0, 0]} />
                        <defs>
                          <linearGradient id="colorGradient2" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#e879f9" stopOpacity={0.8} />
                            <stop offset="100%" stopColor="#d946ef" stopOpacity={0.3} />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </ChartCard>
              </motion.div>

              {/* Activity Feed - card layout on mobile */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300">
                <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gradient-to-r from-white/[0.02] to-transparent">
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <span aria-hidden>📊</span>
                    Recent Activity
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => downloadCSV(data.records, data.url.shortCode)}
                      disabled={data.records.length === 0}
                      className="gap-1.5 text-xs px-3 py-2"
                      title="Download CSV"
                    >
                      <Download className="w-3.5 h-3.5" />
                      CSV
                    </Button>
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => setShowDetailsModal(true)}
                      className="text-xs px-3 py-2 !bg-cyan-500/10 !text-cyan-400 border-cyan-500/20 hover:!bg-cyan-500/20"
                    >
                      View All →
                    </Button>
                  </div>
                </div>
                <div className="divide-y divide-white/5 max-h-80 sm:max-h-96 overflow-y-auto">
                  {data.records.length === 0 ? (
                    <div className="px-4 sm:px-6 py-8 sm:py-12 text-center text-slate-500">
                      <p className="font-medium text-slate-400 text-sm">No clicks yet</p>
                      <p className="text-xs sm:text-sm mt-1">Activity appears when someone uses your link.</p>
                    </div>
                  ) : data.records.slice(0, 8).map((r, idx) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="px-4 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] sm:text-xs text-slate-400 font-mono mb-1.5">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[11px] sm:text-xs font-medium">
                            <Globe className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 shrink-0" />
                            {r.country ?? 'Unknown'}
                          </span>
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-fuchsia-500/20 border border-fuchsia-500/30 text-fuchsia-300 text-[11px] sm:text-xs font-medium">
                            <Monitor className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 shrink-0" />
                            {r.browser ?? 'Unknown'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] sm:text-xs text-slate-500 truncate sm:max-w-[150px]">
                        {r.referrer ?? 'Direct'}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Details Modal - cards on mobile, table on desktop */}
        <Dialog open={showDetailsModal} onClose={() => setShowDetailsModal(false)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:px-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
          <Dialog.Panel as={motion.div}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="relative w-full sm:max-w-3xl max-h-[85vh] sm:max-h-[28rem] bg-gradient-to-br from-slate-900 to-slate-950 rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/10 border-b-0 sm:border-b shadow-2xl flex flex-col"
          >
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent shrink-0">
              <Dialog.Title className="text-base sm:text-lg font-bold text-white">All Activity</Dialog.Title>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowDetailsModal(false)}
                className="p-2"
                aria-label="Close modal"
              >
                ✕
              </Button>
            </div>
            <div className="overflow-y-auto flex-1 min-h-0">
              {/* Mobile: card list */}
              <div className="sm:hidden divide-y divide-white/5">
                {(data?.records ?? []).map((r, idx) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: idx * 0.02 }}
                    className="px-4 py-3"
                  >
                    <p className="text-[11px] text-slate-500 font-mono mb-2">{new Date(r.createdAt).toLocaleString()}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-cyan-300">{r.country ?? 'Unknown'}</span>
                      <span className="text-xs text-fuchsia-300">{r.browser ?? 'Unknown'}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-1">{r.referrer ?? 'Direct'}</p>
                  </motion.div>
                ))}
              </div>
              {/* Desktop: table */}
              <table className="hidden sm:table w-full text-sm">
                <thead className="sticky top-0 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/10">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400">Time</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400">Country</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400">Browser</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-slate-400">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(data?.records ?? []).map((r, idx) => (
                    <motion.tr
                      key={r.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="hover:bg-white/[0.03] transition-colors"
                    >
                      <td className="px-6 py-3 text-slate-400 text-xs font-mono">{new Date(r.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-3 text-cyan-300 text-xs font-medium">{r.country ?? 'Unknown'}</td>
                      <td className="px-6 py-3 text-fuchsia-300 text-xs font-medium">{r.browser ?? 'Unknown'}</td>
                      <td className="px-6 py-3 text-slate-400 text-xs truncate">{r.referrer ?? 'Direct'}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </Layout>
  );
};

function MetricCard({
  icon,
  label,
  value,
  color,
  delay
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
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
        <motion.div className="relative text-white/30 mb-2 sm:mb-4 w-fit">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`w-8 h-8 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br ${color} p-1.5 sm:p-2.5 text-white shadow-lg flex items-center justify-center`}
          >
            {icon}
          </motion.div>
        </motion.div>
        <p className="text-[10px] sm:text-sm font-medium text-slate-400 mb-0.5 sm:mb-2 truncate">{label}</p>
        <motion.p
          className={`text-2xl sm:text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  );
}

function ChartCard({
  title,
  icon,
  delay,
  children
}: {
  title: string;
  icon: React.ReactNode;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ boxShadow: '0 20px 40px -10px rgba(34, 211, 238, 0.1)' }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:border-white/20 shadow-lg transition-all duration-300 group"
    >
      <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2 mb-4 sm:mb-6 group-hover:text-cyan-400 transition-colors">
        <span>{icon}</span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
}
