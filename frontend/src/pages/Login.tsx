import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error('Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      {/* animated background orbs */}
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />

      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-10 items-center">
        {/* left 3D marketing panel */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/60 via-cyan-400/40 to-sky-500/40 rounded-3xl opacity-60 blur-xl" />
            <div className="relative h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/70 shadow-[0_24px_80px_rgba(15,23,42,0.9)] transform-gpu rotate-[-2deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),transparent_60%)]" />
              <div className="relative h-full flex flex-col justify-between p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/80 mb-3">
                    Smurl dashboard
                  </p>
                  <h1 className="text-2xl font-semibold mb-2">
                    See every click in motion.
                  </h1>
                  <p className="text-xs text-slate-400 max-w-sm">
                    Log in to explore rich analytics, countries, browsers and live performance of
                    your short links in a single, cinematic dashboard.
                  </p>
                </div>
                <div className="flex items-end justify-between gap-4 text-[11px] text-slate-300/90">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="font-medium text-emerald-300">Real‑time tracking</span>
                    </div>
                    <p className="text-slate-400/90">Every redirect quietly records a data point.</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-slate-400">Powered by</span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-2 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-400" />
                      <span>Fastify • React • PG</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right auth card */}
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-br from-slate-200/10 via-slate-100/5 to-transparent rounded-3xl opacity-80 blur-xl" />
          <div className="relative bg-slate-900/80 border border-slate-800/90 rounded-3xl px-7 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.95)] backdrop-blur-xl transform-gpu hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Welcome back</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">
                  Sign in to manage your links and see detailed analytics.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-full border border-slate-700/80 bg-slate-900/70">
                  URL Studio · Pro
                </span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@studio.dev"
                    className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/60 transition"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-500">
                    @
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/60 transition"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(15,118,110,0.65)] hover:brightness-110 disabled:opacity-60 disabled:shadow-none transition-all duration-300"
              >
                {loading ? 'Signing in…' : 'Sign in to Smurl'}
              </button>
            </form>

            <p className="mt-5 text-[11px] text-slate-400 text-center">
              Don&apos;t have an account?{' '}
              <Link to="/register" className="text-teal-300 hover:text-teal-200 underline-offset-2 hover:underline">
                Create one for free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

