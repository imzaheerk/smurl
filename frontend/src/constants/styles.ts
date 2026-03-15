/**
 * Shared Tailwind class strings to avoid repetition and keep focus/link styles consistent.
 * Use with template literals: className={`... ${FOCUS_RING_TEAL}`}
 */

/** Teal focus ring (landing, footer, auth pages). */
export const FOCUS_RING_TEAL =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

/** Cyan focus ring (dashboard header nav). */
export const FOCUS_RING_CYAN =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';

/** Footer/list link: hover + focus. */
export const LINK_HOVER_FOCUS =
  'hover:text-teal-300 rounded ' + FOCUS_RING_TEAL;

/** Slate card base (border + background). */
export const CARD_SLATE_BASE = 'rounded-2xl border border-slate-800 bg-slate-950/80';

/** Slate card with padding (e.g. p-4). */
export const CARD_SLATE_P4 = CARD_SLATE_BASE + ' p-4';
export const CARD_SLATE_P3 = CARD_SLATE_BASE + ' p-3';
export const CARD_SLATE_P5 = CARD_SLATE_BASE + ' p-5';

/** Smaller radius card for FAQ disclosure. */
export const CARD_SLATE_XL = 'rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden';

/** Base input (form fields). Append border/focus per theme. */
export const INPUT_BASE =
  'w-full rounded-xl bg-slate-950/80 px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none transition';

/** Dashboard/cyan theme input. */
export const INPUT_CYAN = INPUT_BASE + ' border border-white/10 text-white focus:ring-2 focus:ring-cyan-500/50';

/** Teal theme input (landing, login). */
export const INPUT_TEAL = INPUT_BASE + ' border border-slate-800 focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/50';

/** Violet theme input (register). */
export const INPUT_VIOLET = INPUT_BASE + ' border border-slate-800 focus:ring-2 focus:ring-violet-500/70 focus:border-violet-400/60';

/** Small secondary button (Copy, Share) in dashboard tables. */
export const BTN_SECONDARY_CYAN_SM =
  'shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 transition-all ' +
  FOCUS_RING_CYAN.replace('ring-offset-slate-950', 'ring-offset-slate-900');
