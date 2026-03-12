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
  YAxis,
  PieChart,
  Pie
} from 'recharts';
import { motion } from 'framer-motion';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { Dialog } from '@headlessui/react';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { Globe, Monitor, ArrowRight, TrendingUp } from 'lucide-react';
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
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'country' | 'browser'>('country');
  const [showDetailsModal, setShowDetailsModal] = useState(false);

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

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Header */}
          <div className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 hover:text-cyan-300 mb-6 transition-colors group"
              >
                <ArrowRight className="w-4 h-4 transform group-hover:-rotate-180 transition-transform" />
                Back to Dashboard
              </Link>
              {data && (
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-2 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-red-400 bg-clip-text text-transparent">
                      Analytics Dashboard
                    </h1>
                    <a
                      href={`http://localhost:5000/${data.url.shortCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 font-mono text-cyan-400 hover:text-cyan-300 text-sm group transition-all"
                    >
                      <Globe className="w-4 h-4" />
                      smurl.click/{data.url.shortCode}
                      <ArrowTopRightOnSquareIcon className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 rounded-xl text-sm font-semibold text-cyan-300"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Active Link
                  </motion.div>
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

          {data && !loading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Metrics Cards */}
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Charts Section */}
              <motion.div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ChartCard
                  title="Clicks by Country"
                  icon={<Globe className="w-5 h-5" />}
                  delay={0.3}
                >
                  <div className="h-80">
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

              {/* Activity Feed */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      📊
                    </motion.span>
                    Recent Activity
                  </h3>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDetailsModal(true)}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40"
                  >
                    View All →
                  </motion.button>
                </div>
                <div className="divide-y divide-white/5 max-h-96 overflow-y-auto">
                  {data.records.slice(0, 8).map((r, idx) => (
                    <motion.div
                      key={r.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
                      className="px-6 py-4 flex items-center justify-between group cursor-pointer"
                    >
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-mono mb-1">
                          {new Date(r.createdAt).toLocaleString()}
                        </p>
                        <div className="flex items-center gap-3">
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30 text-cyan-300 text-xs font-semibold"
                          >
                            <Globe className="w-3 h-3 mr-1.5" />
                            {r.country ?? 'Unknown'}
                          </motion.span>
                          <motion.span
                            whileHover={{ scale: 1.1 }}
                            className="inline-flex items-center px-2.5 py-1 rounded-lg bg-gradient-to-r from-fuchsia-500/20 to-fuchsia-500/5 border border-fuchsia-500/30 text-fuchsia-300 text-xs font-semibold"
                          >
                            <Monitor className="w-3 h-3 mr-1.5" />
                            {r.browser ?? 'Unknown'}
                          </motion.span>
                        </div>
                      </div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        className="text-xs text-slate-400 truncate max-w-[150px]"
                      >
                        {r.referrer ?? 'Direct'}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>

        {/* Details Modal */}
        <Dialog open={showDetailsModal} onClose={() => setShowDetailsModal(false)} className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative max-w-3xl w-full max-h-96 bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
              <Dialog.Title className="text-lg font-bold text-white">All Activity</Dialog.Title>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetailsModal(false)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
              >
                ✕
              </motion.button>
            </div>
            <div className="overflow-y-auto max-h-80">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gradient-to-r from-white/[0.03] to-transparent border-b border-white/10">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400">Country</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400">Browser</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-slate-400">Referrer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {data?.records.map((r, idx) => (
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
          </motion.div>
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
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-0.5 group cursor-pointer`}
    >
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-950 p-6 backdrop-blur-xl">
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, transparent, rgba(255,255,255,0.05))`,
          }}
        />
        <motion.div className="relative text-white/30 mb-4 w-fit">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} p-2.5 text-white shadow-lg`}
          >
            {icon}
          </motion.div>
        </motion.div>
        <p className="text-sm font-medium text-slate-400 mb-2">{label}</p>
        <motion.p
          className={`text-4xl font-bold bg-gradient-to-r ${color} bg-clip-text text-transparent`}
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
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 shadow-lg transition-all duration-300 group"
    >
      <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6 group-hover:text-cyan-400 transition-colors">
        <motion.span
          animate={{ rotate: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {icon}
        </motion.span>
        {title}
      </h3>
      {children}
    </motion.div>
  );
};
