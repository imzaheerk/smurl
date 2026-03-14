import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';

export const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/register', { email, password });
      toast.success('Account created! Sign in to get started.');
      navigate('/login');
    } catch (err) {
      console.error(err);
      toast.error('Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50 bg-grid flex items-center justify-center px-4 py-10">
      {/* animated gradients */}
      <div className="pointer-events-none absolute -top-32 right-0 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 -left-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" aria-hidden />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl animate-[pulse_8s_ease-in-out_infinite]" aria-hidden />

      {/* Back to home */}
      <Link
        to="/"
        className="absolute top-4 left-4 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg px-3 py-2 transition-colors z-10"
      >
        <span aria-hidden>←</span>
        Back to home
      </Link>

      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-[1fr,1.05fr] gap-10 items-center">
        {/* left copy / 3D card */}
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-violet-500/60 via-purple-400/40 to-teal-400/40 rounded-3xl opacity-60 blur-xl" />
            <div className="relative h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/70 shadow-[0_24px_80px_rgba(15,23,42,0.9)] transform-gpu rotate-[2deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(129,140,248,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(45,212,191,0.18),transparent_60%)]" />
              <div className="relative h-full flex flex-col justify-between p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-200/80 mb-3">
                    Create your space
                  </p>
                  <h1 className="text-2xl md:text-3xl font-semibold mb-2 text-slate-50 leading-tight">
                    Smarter links start with your account.
                  </h1>
                  <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
                    Save every short link, plug in your domains, and unlock deep analytics that stay
                    in sync across campaigns and devices.
                  </p>
                </div>
                <div className="flex items-end justify-between gap-4 text-[11px] text-slate-300/90">
                  <div className="space-y-1">
                    <p className="font-medium text-teal-200">What you get</p>
                    <p className="text-slate-400/90">
                      History, analytics, custom aliases, and more — all tied to your profile.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="px-2 py-1 rounded-full bg-slate-950/80 border border-slate-700">
                      Free to start
                    </span>
                    <span className="text-slate-400">Upgrade as you grow.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* right auth card */}
        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-br from-slate-200/10 via-slate-100/5 to-transparent rounded-3xl opacity-80 blur-xl" />
          <div className="relative bg-slate-900/85 border border-slate-800/90 rounded-3xl px-7 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.95)] backdrop-blur-xl transform-gpu hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Create your Smurl account</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1 max-w-sm">
                  One account for URLs, QR codes, and analytics across every device.
                </p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-full border border-slate-700/80 bg-slate-900/70">
                  Secure by design
                </span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Encrypted passwords
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label htmlFor="register-email" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Email
                </label>
                <input
                  id="register-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@brand.com"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-400/60 transition"
                />
              </div>
              <div>
                <label htmlFor="register-password" className="block text-xs font-medium text-slate-300 mb-1.5">
                  Password
                </label>
                <input
                  id="register-password"
                  type="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500/70 focus:border-violet-400/60 transition"
                />
                <p className="mt-1.5 text-xs text-slate-500" role="status">
                  Use a strong password — we hash it before storing.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-1 w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-300 px-4 py-2.5 text-sm font-semibold text-slate-950 shadow-[0_18px_45px_rgba(124,58,237,0.65)] hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300"
              >
                {loading ? 'Creating your workspace…' : 'Create account'}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">What&apos;s included (free)</p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400/80 shrink-0" aria-hidden />
                  Save and manage all your short links in one place
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400/80 shrink-0" aria-hidden />
                  Per-link analytics: clicks, country, browser, referrer
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400/80 shrink-0" aria-hidden />
                  QR codes for every link; optional active time window
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-violet-400/80 shrink-0" aria-hidden />
                  Custom domains & API keys (Settings after signup)
                </li>
              </ul>
            </div>

            <p className="mt-6 text-sm text-slate-400 text-center">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-violet-300 hover:text-violet-200 font-medium underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
              >
                Sign in instead
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

