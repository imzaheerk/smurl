import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import {
  APP_BG,
  APP_NAV_LINK,
  APP_NAV_LINK_ACTIVE,
  LANDING_FOCUS
} from './app/appTheme';

interface LayoutProps {
  children: ReactNode;
}

function isDashboardArea(pathname: string) {
  return pathname === ROUTES.DASHBOARD || pathname.startsWith('/analytics/');
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth(false);
  const { pathname } = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isDashboard = isDashboardArea(pathname);
  const isSettings = pathname === ROUTES.SETTINGS;

  return (
    <div className="min-h-dvh text-white antialiased" style={{ backgroundColor: APP_BG }}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />
        <div className="absolute -right-24 top-1/3 h-64 w-64 rounded-full bg-amber-500/8 blur-[90px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '56px 56px'
          }}
        />
      </div>

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0514]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-4 sm:py-4 md:px-6 md:py-5">
          <Link
            to={ROUTES.DASHBOARD}
            className={'group relative flex shrink-0 items-center gap-2.5 rounded-lg ' + LANDING_FOCUS}
            aria-label="Smurl dashboard home"
          >
            <div
              className="pointer-events-none absolute left-0 top-1/2 h-10 w-10 -translate-y-1/2 rounded-xl bg-fuchsia-500/25 blur-lg"
              aria-hidden
            />
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-fuchsia-400/40 bg-fuchsia-500/10 text-sm font-bold text-fuchsia-300 shadow-lg shadow-fuchsia-500/15 transition group-hover:border-fuchsia-400/70 group-hover:bg-fuchsia-500/20">
              S
            </span>
            <span
              className="relative text-lg font-semibold text-fuchsia-200/90 transition group-hover:text-fuchsia-100 sm:text-xl"
              style={{ fontFamily: "'Dancing Script', cursive" }}
            >
              Smurl
            </span>
          </Link>

          <nav className="flex shrink-0 items-center gap-1 sm:gap-1.5" aria-label="Main navigation">
            <Link
              to={ROUTES.DASHBOARD}
              aria-label="Dashboard"
              aria-current={isDashboard ? 'page' : undefined}
              className={
                (isDashboard ? APP_NAV_LINK_ACTIVE : APP_NAV_LINK) +
                ' min-h-[40px] min-w-[40px] justify-center px-2.5 sm:min-w-0 sm:justify-start sm:px-3.5 ' +
                LANDING_FOCUS
              }
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to={ROUTES.SETTINGS}
              aria-label="Settings"
              aria-current={isSettings ? 'page' : undefined}
              className={
                (isSettings ? APP_NAV_LINK_ACTIVE : APP_NAV_LINK) +
                ' min-h-[40px] min-w-[40px] justify-center px-2.5 sm:min-w-0 sm:justify-start sm:px-3.5 ' +
                LANDING_FOCUS
              }
            >
              <Settings className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Settings</span>
            </Link>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label="Log out"
              className={
                APP_NAV_LINK +
                ' min-h-[40px] min-w-[40px] justify-center px-2.5 sm:min-w-0 sm:justify-start sm:px-3.5 ' +
                LANDING_FOCUS
              }
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </nav>
        </div>
      </header>

      <LogoutConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={logout} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
};
