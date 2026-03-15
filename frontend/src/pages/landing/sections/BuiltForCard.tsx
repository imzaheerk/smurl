import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { FOCUS_RING_TEAL } from '../../../constants/styles';

const CARD_CLASS =
  'group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 hover:border-teal-500/40 hover:bg-slate-900/60 transition-all ' +
  FOCUS_RING_TEAL;

const ICON_BOX_CLASS =
  'flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20 transition-colors';

export interface BuiltForCardProps {
  to: string;
  icon: ReactNode;
  title: string;
  description: string;
  ctaText: string;
}

export function BuiltForCard({ to, icon, title, description, ctaText }: BuiltForCardProps) {
  return (
    <Link to={to} className={CARD_CLASS}>
      <div className={ICON_BOX_CLASS}>
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-100">{title}</h3>
      <p className="text-xs text-slate-400">{description}</p>
      <span className="text-xs font-medium text-teal-400 group-hover:text-teal-300 mt-auto">
        {ctaText}
      </span>
    </Link>
  );
}
