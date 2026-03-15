import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FOCUS_RING_CYAN, FOCUS_RING_TEAL } from '../../constants/styles';

/** "Back to Dashboard" / "Back to home" link with arrow. */
const BASE_CLASS = 'inline-flex items-center gap-2 text-xs sm:text-sm font-semibold mb-4 sm:mb-6 transition-colors rounded-lg px-1 py-0.5 touch-manipulation';

const themeClass = {
  cyan: 'text-cyan-400 hover:text-cyan-300 ' + FOCUS_RING_CYAN,
  slate: 'text-slate-400 hover:text-slate-200 ' + FOCUS_RING_TEAL,
} as const;

export interface BackLinkProps {
  to: string;
  children: ReactNode;
  /** cyan = dashboard/settings style, slate = auth pages (login/register). */
  theme?: keyof typeof themeClass;
  className?: string;
}

export function BackLink({ to, children, theme = 'cyan', className = '' }: BackLinkProps) {
  return (
    <Link to={to} className={`${BASE_CLASS} ${themeClass[theme]} ${className}`.trim()}>
      {children}
    </Link>
  );
}
