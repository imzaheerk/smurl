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

const TITLE_CLASS =
  'mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-fuchsia-400/60';
const LIST_CLASS = 'space-y-2.5 text-sm text-violet-200/55';

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
