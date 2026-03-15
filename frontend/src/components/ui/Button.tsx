import { type ButtonHTMLAttributes, type ReactNode } from 'react';
import { FOCUS_RING_CYAN, FOCUS_RING_TEAL } from '../../constants/styles';

type ButtonVariant =
  | 'primaryTeal'   // Login, landing CTA
  | 'primaryViolet' // Register
  | 'primaryCyan'   // Dashboard/UrlForm cyan gradient
  | 'primaryCyanSolid' // Solid cyan (e.g. modal Done)
  | 'secondary'     // Outline slate (demo login, secondary actions)
  | 'secondaryGray' // Modal cancel (bg-slate-700)
  | 'secondaryCyan' // Dashboard style (white/5, cyan hover/focus)
  | 'danger'        // Delete, logout
  | 'ghost'         // Icon-only, minimal (close X)
  | 'tab';          // Filter/folder chips (active vs inactive)

const variantClasses: Record<ButtonVariant, string> = {
  primaryTeal:
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-teal-400 via-emerald-400 to-sky-400 text-slate-950 shadow-[0_18px_45px_rgba(15,118,110,0.65)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ' +
    FOCUS_RING_TEAL,
  primaryViolet:
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-300 text-slate-950 shadow-[0_18px_45px_rgba(124,58,237,0.65)] hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900',
  primaryCyan:
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all ' +
    FOCUS_RING_CYAN.replace('ring-offset-slate-950', 'ring-offset-slate-900'),
  primaryCyanSolid:
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold bg-cyan-600 text-white hover:bg-cyan-500 disabled:opacity-50 transition-colors',
  secondary:
    'inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-800 disabled:opacity-60 transition-all duration-300 ' +
    FOCUS_RING_TEAL,
  secondaryGray:
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-slate-700 text-slate-200 hover:bg-slate-600 hover:scale-105 transition-all',
  secondaryCyan:
    'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:border-cyan-500/30 disabled:opacity-50 transition-all touch-manipulation ' +
    FOCUS_RING_CYAN.replace('ring-offset-slate-950', 'ring-offset-slate-900'),
  danger:
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 transition-all ' +
    FOCUS_RING_TEAL,
  ghost:
    'p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400',
  tab: 'px-2.5 py-2 sm:px-3 sm:py-1.5 rounded-lg text-xs font-medium transition-all touch-manipulation '
};

const tabActiveClass = 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40';
const tabInactiveClass = 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  /** For variant="tab": when true, use active (selected) style. */
  active?: boolean;
  fullWidth?: boolean;
  children: ReactNode;
}

export function Button({
  variant = 'primaryCyan',
  active,
  fullWidth,
  className = '',
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  let base = variantClasses[variant];
  if (variant === 'tab') {
    base += active ? tabActiveClass : tabInactiveClass;
  }
  if (fullWidth) {
    base += ' w-full';
  }
  return (
    <button type={type} className={base + (className ? ' ' + className : '')} {...rest}>
      {children}
    </button>
  );
}
