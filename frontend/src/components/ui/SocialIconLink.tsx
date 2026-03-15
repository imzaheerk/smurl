import { type ReactNode } from 'react';
import { FOCUS_RING_TEAL } from '../../constants/styles';

interface SocialIconLinkProps {
  href: string;
  ariaLabel: string;
  children: ReactNode;
}

const BASE_CLASS =
  'p-2 rounded-lg border border-slate-700/80 text-slate-400 hover:border-teal-400/60 hover:text-teal-300 transition-colors ' +
  FOCUS_RING_TEAL;

export function SocialIconLink({ href, ariaLabel, children }: SocialIconLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={BASE_CLASS}
      aria-label={ariaLabel}
    >
      {children}
    </a>
  );
}
