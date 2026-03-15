import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { LINK_HOVER_FOCUS } from '../../constants/styles';

interface AppLinkProps {
  children: ReactNode;
  /** React Router path (use for in-app routes). */
  to?: string;
  /** External URL or hash (use for external or mailto:). */
  href?: string;
  className?: string;
}

/**
 * Link or anchor with consistent hover + focus styles (e.g. footer links).
 * Use `to` for in-app routes, `href` for external or hash links.
 */
export function AppLink({ children, to, href, className = '' }: AppLinkProps) {
  const linkClass = LINK_HOVER_FOCUS + (className ? ' ' + className : '');

  if (to !== undefined) {
    return (
      <Link to={to} className={linkClass}>
        {children}
      </Link>
    );
  }

  if (href !== undefined) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:');
    return (
      <a
        href={href}
        className={linkClass}
        {...(isExternal && href.startsWith('http')
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        {children}
      </a>
    );
  }

  return null;
}
