import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LANDING_FOCUS } from '../constants/theme';

export interface BuiltForCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  ctaText: string;
  accent: string;
}

export function BuiltForCard({ to, icon, title, description, ctaText, accent }: BuiltForCardProps) {
  return (
    <Link
      to={to}
      className={
        'group flex flex-1 flex-col gap-3 rounded-2xl border border-white/[0.06] bg-gradient-to-br p-5 transition-all hover:border-fuchsia-500/25 hover:bg-white/[0.04] ' +
        accent +
        ' ' +
        LANDING_FOCUS
      }
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-400 transition-colors group-hover:bg-fuchsia-500/20">
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <p className="text-xs leading-relaxed text-violet-200/50">{description}</p>
      <span className="mt-auto text-xs font-medium text-fuchsia-400 group-hover:text-fuchsia-300">
        {ctaText}
      </span>
    </Link>
  );
}
