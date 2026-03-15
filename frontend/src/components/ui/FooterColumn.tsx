import { AppLink } from './AppLink';

export interface FooterLinkItem {
  label: string;
  to?: string;
  href?: string;
}

interface FooterColumnProps {
  title: string;
  links: FooterLinkItem[];
}

const TITLE_CLASS = 'text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3';
const LIST_CLASS = 'space-y-2 text-sm text-slate-400';

export function FooterColumn({ title, links }: FooterColumnProps) {
  return (
    <div>
      <p className={TITLE_CLASS}>{title}</p>
      <ul className={LIST_CLASS}>
        {links.map((link) => (
          <li key={link.label}>
            <AppLink to={link.to} href={link.href}>
              {link.label}
            </AppLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
