import { useEffect, useId, useRef } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui';
import { useLogin } from './hooks/useLogin';

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 transition focus:border-teal-400/45 focus:outline-none focus:ring-1 focus:ring-teal-500/40 sm:px-3.5 sm:py-2.5';

export const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const emailFieldId = `${formId}-email`;
  const passwordFieldId = `${formId}-password`;

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
    handleDemoLogin,
    handleGuestLogin,
    isDemoLoginEnabled
  } = useLogin();

  useEffect(() => {
    emailRef.current?.focus({ preventScroll: true });
  }, []);

  const busy = loading || demoLoading;

  return (
    <div>
      <div className="mb-4 space-y-0.5 max-[760px]:mb-2 sm:mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">Welcome back</h1>
        <p className="text-xs leading-snug text-slate-400 sm:text-sm sm:leading-relaxed">
          Sign in with the email you used to register. We&apos;ll take you straight to the dashboard.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-3 max-[760px]:space-y-2.5"
        aria-busy={busy}
        noValidate
      >
        <div>
          <label htmlFor={emailFieldId} className="mb-1.5 block text-xs font-medium text-slate-400">
            Email
          </label>
          <div className="relative">
            <input
              ref={emailRef}
              id={emailFieldId}
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@studio.dev"
              className={inputClass}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[11px] text-slate-600">
              @
            </span>
          </div>
        </div>
        <div>
          <label htmlFor={passwordFieldId} className="mb-1.5 block text-xs font-medium text-slate-400">
            Password
          </label>
          <div className="relative">
            <input
              id={passwordFieldId}
              type={showPassword ? 'text' : 'password'}
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`${inputClass} pr-10`}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 right-2 flex min-h-0 items-center !p-0 text-slate-500 hover:text-slate-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-controls={passwordFieldId}
            >
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primaryViolet"
          fullWidth
          disabled={busy}
          className="mt-0.5 h-10 rounded-xl text-sm font-semibold shadow-lg shadow-violet-900/25 sm:h-11"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>

        <div className="flex items-center gap-2 py-0.5 sm:gap-3 sm:py-1">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <span className="shrink-0 text-[10px] font-medium uppercase tracking-[0.18em] text-slate-500">
            Try without signing up
          </span>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
        </div>
        {isDemoLoginEnabled && (
          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={handleDemoLogin}
            disabled={busy}
            className="h-10 rounded-xl border border-white/10 bg-white/[0.05] text-slate-200 hover:bg-white/[0.08] sm:h-11"
          >
            {demoLoading ? 'Connecting demo…' : 'Demo account'}
          </Button>
        )}
        <Button
          type="button"
          variant="secondaryCyan"
          fullWidth
          onClick={handleGuestLogin}
          disabled={busy}
          className="h-10 rounded-xl border border-teal-500/25 bg-teal-500/[0.08] text-teal-50 hover:bg-teal-500/15 sm:h-11"
        >
          Guest mode (local demo)
        </Button>
      </form>

      <div className="mt-3 border-t border-white/[0.06] pt-3 sm:mt-4 sm:pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Your account unlocks
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['Analytics', 'QR codes', 'API keys', 'Domains'].map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/[0.07] bg-white/[0.04] px-2 py-0.5 text-[10px] font-medium text-slate-400"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
