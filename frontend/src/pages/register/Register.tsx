import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { Button } from '../../components/ui';
import { useRegister } from './hooks/useRegister';

const inputClass =
  'w-full rounded-xl border border-white/[0.08] bg-black/30 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 transition focus:border-violet-400/45 focus:outline-none focus:ring-1 focus:ring-violet-500/40 sm:px-3.5 sm:py-2.5';

function strengthLabel(score: number): { text: string; barClass: string } {
  if (score <= 0) return { text: '', barClass: 'bg-slate-700' };
  if (score === 1) return { text: 'Too short', barClass: 'bg-rose-500/80' };
  if (score === 2) return { text: 'Okay', barClass: 'bg-amber-400/90' };
  return { text: 'Strong', barClass: 'bg-emerald-400/90' };
}

function computeStrength(password: string): number {
  if (password.length === 0) return 0;
  if (password.length < 6) return 1;
  let score = 2;
  if (password.length >= 10) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return Math.min(3, score);
}

export const Register = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const formId = useId();
  const emailId = `${formId}-email`;
  const passwordId = `${formId}-password`;
  const confirmId = `${formId}-confirm`;

  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    handleSubmit
  } = useRegister();

  const strength = useMemo(() => computeStrength(password), [password]);
  const { text: strengthText, barClass } = strengthLabel(strength);
  const confirmMismatch =
    confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    emailRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <div>
      <div className="mb-4 space-y-0.5 max-[760px]:mb-2 sm:mb-5">
        <h1 className="text-lg font-semibold tracking-tight text-white sm:text-xl md:text-2xl">
          Create your account
        </h1>
        <p className="text-xs leading-snug text-slate-400 sm:text-sm sm:leading-relaxed">
          Free to start. After signup you&apos;ll sign in with this email and password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 max-[760px]:space-y-2.5" noValidate aria-busy={loading}>
        <div>
          <label htmlFor={emailId} className="mb-1.5 block text-xs font-medium text-slate-400">
            Email
          </label>
          <input
            ref={emailRef}
            id={emailId}
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@brand.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={passwordId} className="mb-1.5 block text-xs font-medium text-slate-400">
            Password
          </label>
          <div className="relative">
            <input
              id={passwordId}
              type={showPassword ? 'text' : 'password'}
              name="new-password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className={`${inputClass} pr-10`}
              minLength={6}
            />
            <Button
              type="button"
              variant="ghost"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-2 flex min-h-0 items-center !p-0 text-slate-500 hover:text-slate-300"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-controls={passwordId}
            >
              {showPassword ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
            </Button>
          </div>
          <div className="mt-1.5 flex items-center gap-2 max-[760px]:mt-1 sm:mt-2">
            <div className="flex flex-1 gap-1" role="meter" aria-valuenow={strength} aria-valuemin={0} aria-valuemax={3} aria-label="Password strength">
              {[1, 2, 3].map((seg) => (
                <span
                  key={seg}
                  className={`h-0.5 flex-1 rounded-full transition-colors sm:h-1 ${
                    strength >= seg ? barClass : 'bg-white/[0.06]'
                  }`}
                />
              ))}
            </div>
            {strengthText ? (
              <p className={`shrink-0 text-[10px] sm:text-[11px] ${strength === 1 ? 'text-rose-400/90' : 'text-slate-500'}`}>
                {strengthText}
              </p>
            ) : null}
          </div>
        </div>

        <div>
          <label htmlFor={confirmId} className="mb-1.5 block text-xs font-medium text-slate-400">
            Confirm password
          </label>
          <input
            id={confirmId}
            type={showPassword ? 'text' : 'password'}
            name="confirm-password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat password"
            className={`${inputClass} ${confirmMismatch ? 'border-rose-500/40 ring-1 ring-rose-500/25' : ''}`}
          />
          {confirmMismatch ? (
            <p className="mt-1.5 text-[11px] text-rose-400/90" role="status">
              Passwords must match.
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-slate-600" role="status">
              We only store a secure hash of your password.
            </p>
          )}
        </div>

        <Button
          type="submit"
          variant="primaryViolet"
          fullWidth
          disabled={loading}
          className="mt-0.5 h-10 rounded-xl text-sm font-semibold shadow-lg shadow-violet-900/25 sm:h-11"
        >
          {loading ? 'Creating workspace…' : 'Create account'}
        </Button>
      </form>

      <div className="mt-3 border-t border-white/[0.06] pt-3 sm:mt-4 sm:pt-4">
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          Included on the free plan
        </p>
        <div className="flex flex-wrap gap-1.5">
          {['Link history', 'Per-link stats', 'QR export', 'Settings'].map((t) => (
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
