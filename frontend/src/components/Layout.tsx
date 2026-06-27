import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { AppLogo } from './AppLogo';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';
import { APP_BG, LANDING_FOCUS } from './app/appTheme';

interface LayoutProps {
  children: ReactNode;
}

function isDashboardArea(pathname: string) {
  return pathname === ROUTES.DASHBOARD || pathname.startsWith('/analytics/');
}

const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, match: isDashboardArea },
  { to: ROUTES.SETTINGS, label: 'Settings', icon: Settings, match: (p: string) => p === ROUTES.SETTINGS }
] as const;

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth(false);
  const { pathname } = useLocation();
  const [confirmOpen, setConfirmOpen] = useState(false);

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

      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0514]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0514]/70">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/25 to-transparent" aria-hidden />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-3.5">
          <AppLogo to={ROUTES.DASHBOARD} />

          <div className="flex items-center gap-2 sm:gap-3">
            <nav
              className="flex items-center gap-0.5 rounded-xl border border-white/[0.08] bg-[#0c0818]/60 p-1 backdrop-blur-sm"
              aria-label="Main navigation"
            >
              {NAV_ITEMS.map(({ to, label, icon: Icon, match }) => {
                const active = match(pathname);
                return (
                  <Link
                    key={to}
                    to={to}
                    aria-label={label}
                    aria-current={active ? 'page' : undefined}
                    className={
                      'relative flex min-h-[36px] min-w-[36px] items-center justify-center gap-2 rounded-lg px-2.5 text-sm font-medium transition sm:min-w-0 sm:px-3.5 sm:py-2 ' +
                      LANDING_FOCUS +
                      ' ' +
                      (active
                        ? 'bg-fuchsia-500/15 text-fuchsia-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                        : 'text-violet-200/55 hover:bg-white/[0.05] hover:text-fuchsia-300')
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="hidden sm:inline">{label}</span>
                    {active && (
                      <span
                        className="absolute -bottom-0.5 left-1/2 hidden h-0.5 w-4 -translate-x-1/2 rounded-full bg-fuchsia-400/80 sm:block"
                        aria-hidden
                      />
                    )}
                  </Link>
                );
              })}
            </nav>

            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              aria-label="Log out"
              className={
                'flex min-h-[36px] items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-[#0c0818]/40 px-2.5 py-2 text-sm font-medium text-violet-200/55 transition hover:border-red-500/25 hover:bg-red-500/10 hover:text-red-300 sm:px-3.5 ' +
                LANDING_FOCUS
              }
            >
              <LogOut className="h-4 w-4 shrink-0" aria-hidden />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <LogoutConfirmModal open={confirmOpen} onClose={() => setConfirmOpen(false)} onConfirm={logout} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-6 md:px-6 md:py-8">{children}</main>
    </div>
  );
};
