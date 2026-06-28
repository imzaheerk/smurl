/** Shared Tailwind classes for the landing page theme. */

export const LANDING_BG = '#0a0514';

export const LANDING_FOCUS =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0514]';

export const LANDING_LINK =
  'text-violet-200/55 transition-colors hover:text-fuchsia-300 rounded ' + LANDING_FOCUS;

export const LANDING_BTN_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 text-[#0a0514] shadow-[0_12px_40px_rgba(232,121,249,0.35)] hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 transition-all duration-300 ' +
  LANDING_FOCUS;

export const LANDING_BTN_SECONDARY =
  'inline-flex items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-semibold border border-white/10 bg-white/5 text-violet-200 hover:border-fuchsia-500/30 hover:bg-white/10 disabled:opacity-50 transition-all touch-manipulation ' +
  LANDING_FOCUS;

export const LANDING_BTN_GHOST =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border border-white/10 bg-white/5 text-violet-200/80 hover:bg-white/10 transition-all';

export const LANDING_CARD =
  'rounded-2xl border border-white/[0.06] bg-white/[0.02]';

export const LANDING_SECTION_LABEL =
  'text-xs font-semibold uppercase tracking-[0.24em] text-fuchsia-400/70';

export const LANDING_SCENE_PANEL =
  'relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c0818]/60 shadow-[0_24px_80px_rgba(0,0,0,0.4)]';
