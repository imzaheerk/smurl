import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { FOCUS_RING_TEAL } from '../../../constants/styles';
import { AppLink, FooterColumn, SocialIconLink } from '../../../components/ui';
import { ScrollReveal } from './ScrollReveal';

const SOCIAL_LINKS = [
  { href: 'https://instagram.com', label: 'Instagram', icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
  { href: 'https://facebook.com', label: 'Facebook', icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  { href: 'https://x.com', label: 'X', icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
] as const;

const FOOTER_COLUMNS = [
  {
    title: 'Features',
    links: [
      { label: 'Link shortening & QR', href: '#shorten' },
      { label: 'Analytics & tracking', to: ROUTES.LOGIN },
      { label: 'Custom domains', to: ROUTES.REGISTER },
      { label: 'API for developers', to: ROUTES.LOGIN },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'FAQ', href: '#faq' },
      { label: 'For developers', to: ROUTES.LOGIN },
      { label: 'How it works', href: '#how-it-works' },
      { label: 'About Smurl', href: '#features' },
    ],
  },
  {
    title: 'Contact us',
    links: [
      { label: 'Support', href: 'mailto:support@smurl.app' },
      { label: 'General inquiry', href: 'mailto:hello@smurl.app' },
      { label: 'Report abuse', href: 'mailto:abuse@smurl.app' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Terms of Service', to: ROUTES.TERMS },
      { label: 'Privacy Policy', to: ROUTES.PRIVACY },
      { label: 'Accessibility', to: ROUTES.PRIVACY },
    ],
  },
] as const;

export function LandingFooter() {
  return (
    <section className="mt-20 border-t border-slate-800 pt-12">
      <ScrollReveal>
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-12">
          <div className="shrink-0">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
              Follow us
            </p>
            <div className="flex items-center gap-3">
              {SOCIAL_LINKS.map(({ href, label, icon }) => (
                <SocialIconLink key={label} href={href} ariaLabel={label}>
                  {icon}
                </SocialIconLink>
              ))}
            </div>
            <Link
              to={ROUTES.HOME}
              className={'mt-6 flex items-center gap-2.5 group rounded-lg w-fit ' + FOCUS_RING_TEAL}
            >
              <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-teal-400/80 group-hover:bg-teal-500/20 shrink-0">
                <span className="text-sm font-bold text-teal-400">S</span>
              </div>
              <span className="text-2xl font-semibold text-teal-300/90 group-hover:text-teal-200 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>
                Smurl
              </span>
            </Link>
            <p className="mt-4 text-xs text-slate-400">
              © 2026 smurl<br />
              All Rights Reserved
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 min-w-0">
            {FOOTER_COLUMNS.map((col) => (
              <FooterColumn key={col.title} title={col.title} links={[...col.links]} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
