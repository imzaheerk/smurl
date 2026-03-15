import { Link } from 'react-router-dom';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { ROUTES } from '../../constants/routes';
import { BackLink, Button } from '../../components/ui';
import { useLogin } from './hooks/useLogin';

export const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    demoLoading,
    handleSubmit,
    handleDemoLogin
  } = useLogin();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-50 flex items-center justify-center px-4">
      <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl animate-[pulse_6s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />

      <BackLink to={ROUTES.HOME} theme="slate" className="absolute top-4 left-4 z-10">
        <span aria-hidden>←</span> Back to home
      </BackLink>

      <div className="relative max-w-5xl w-full grid grid-cols-1 md:grid-cols-[1.1fr,1fr] gap-10 items-center">
        <div className="hidden md:block">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/60 via-cyan-400/40 to-sky-500/40 rounded-3xl opacity-60 blur-xl" />
            <div className="relative h-72 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-700/70 shadow-[0_24px_80px_rgba(15,23,42,0.9)] transform-gpu rotate-[-2deg] hover:rotate-0 hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),transparent_60%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.14),transparent_60%)]" />
              <div className="relative h-full flex flex-col justify-between p-7">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-300/80 mb-3">Smurl dashboard</p>
                  <h1 className="text-2xl font-semibold mb-2">See every click in motion.</h1>
                  <p className="text-xs text-slate-400 max-w-sm">Log in to explore rich analytics, countries, browsers and live performance of your short links in a single, cinematic dashboard.</p>
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

        <div className="relative">
          <div className="absolute -inset-[1px] bg-gradient-to-br from-slate-200/10 via-slate-100/5 to-transparent rounded-3xl opacity-80 blur-xl" />
          <div className="relative bg-slate-900/80 border border-slate-800/90 rounded-3xl px-7 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.95)] backdrop-blur-xl transform-gpu hover:-translate-y-1 transition-all duration-500 ease-out">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Welcome back</h2>
                <p className="text-xs md:text-sm text-slate-400 mt-1">Sign in to manage your links and see detailed analytics.</p>
              </div>
              <div className="hidden sm:flex flex-col items-end gap-1 text-[11px] text-slate-400">
                <span className="px-2 py-0.5 rounded-full border border-slate-700/80 bg-slate-900/70">URL Studio · Pro</span>
                <span className="text-emerald-300 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@studio.dev" className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/60 transition" />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-500">@</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-xl bg-slate-950/80 border border-slate-800 px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/60 transition" />
                  <Button type="button" variant="ghost" onClick={() => setShowPassword((prev) => !prev)} className="absolute inset-y-0 right-2 flex items-center !p-0 min-h-0 text-slate-500 hover:text-slate-300" aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button type="submit" variant="primaryViolet" fullWidth disabled={loading || demoLoading} className="mt-1">
                {loading ? 'Signing in…' : 'Sign in to Smurl'}
              </Button>
              <Button type="button" variant="secondary" fullWidth onClick={handleDemoLogin} disabled={demoLoading || loading}>
                {demoLoading ? 'Preparing demo…' : 'Try a demo account (no signup)'}
              </Button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800/80">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">With your account</p>
              <ul className="text-xs text-slate-400 space-y-1.5">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-400/80 shrink-0" aria-hidden /> Dashboard with all your short links and folders</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-400/80 shrink-0" aria-hidden /> Click analytics: country, browser, referrer per link</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-400/80 shrink-0" aria-hidden /> QR codes and optional scheduling (active window)</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-teal-400/80 shrink-0" aria-hidden /> API keys & custom domains in Settings</li>
              </ul>
            </div>

            <p className="mt-5 text-[11px] text-slate-400 text-center">
              Don&apos;t have an account?{' '}
              <Link to={ROUTES.REGISTER} className="text-teal-300 hover:text-teal-200 underline-offset-2 hover:underline">Create one for free</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
