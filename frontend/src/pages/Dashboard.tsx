import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { UrlForm } from '../components/UrlForm';
import { UrlTable } from '../components/UrlTable';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Plus, Link2, BarChart3, TrendingUp, Globe, Zap } from 'lucide-react';
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

        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-red-400 bg-clip-text text-transparent">
                  Your Dashboard
                </h1>
                <p className="text-slate-400 text-lg max-w-xl">
                  Create powerful short links, track performance, and understand your audience with beautiful analytics.
                </p>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 rounded-xl text-sm font-semibold text-cyan-300"
              >
                <Zap className="w-5 h-5" />
                Welcome Back!
              </motion.div>
            </div>
          </motion.div>

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
                <p className="text-slate-400 text-lg font-medium">Loading your dashboard...</p>
              </div>
            </motion.div>
          )}

          {!loading && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              {/* Stats Cards */}
              <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              {/* Create URL Section */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 shadow-lg transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 p-2.5 text-white shadow-lg"
                  >
                    <Plus className="w-6 h-6" />
                  </motion.div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Create New Short Link</h2>
                    <p className="text-slate-400">Transform long URLs into powerful, trackable short links</p>
                  </div>
                </div>
                <UrlForm
                  onCreated={fetchUrls}
                />
              </motion.div>

              {/* URLs Table */}
              <motion.div variants={itemVariants} className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-2xl hover:shadow-cyan-500/10 transition-shadow duration-300">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      🔗
                    </motion.span>
                    Your Short Links
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-400">
                    <Globe className="w-4 h-4" />
                    {total} total links
                  </div>
                </div>
                <UrlTable
                  data={data}
                  refetch={fetchUrls}
                />
                {/* Pagination */}
                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-gradient-to-r from-white/[0.02] to-transparent">
                  <p className="text-sm text-slate-400">
                    Page {page} of {totalPages} · {total} URLs total
                  </p>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      ← Previous
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-40 disabled:pointer-events-none transition-all"
                    >
                      Next →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
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
        <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      </div>
    </motion.div>
  );
}
