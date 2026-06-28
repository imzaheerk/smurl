import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { AppLogo } from '../../../components/AppLogo';
import { ROUTES } from '../../../constants/routes';
import { startGuestSession } from '../../../utils/demoMode';
import { LANDING_FOCUS } from '../constants/theme';

const NAV_ANCHORS = [
  { href: '#features', label: 'Features' },
  { href: '#analytics', label: 'Analytics' },
  { href: '#how-it-works', label: 'How it works' },
  { href: '#faq', label: 'FAQ' }
] as const;

const NAV_LINK_SECONDARY =
  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2.5 text-sm font-semibold text-violet-200/80 transition hover:border-fuchsia-500/30 hover:bg-white/[0.06] ' +
  LANDING_FOCUS;

const NAV_LINK_PRIMARY =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 px-4 py-2.5 text-sm font-semibold text-[#0a0514] shadow-[0_12px_40px_rgba(232,121,249,0.35)] transition-all duration-300 hover:brightness-110 ' +
  LANDING_FOCUS;

export function LandingHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleGuestLogin = () => {
    startGuestSession();
    toast.success('Guest mode enabled with demo data');
    setMenuOpen(false);
    navigate(ROUTES.DASHBOARD);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0a0514]/85 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0a0514]/70 max-sm:pt-[env(safe-area-inset-top,0px)]">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/25 to-transparent" aria-hidden />
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-3.5">
        <AppLogo to={ROUTES.HOME} className="max-sm:py-1.5" />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex lg:gap-2" aria-label="Main">
          {NAV_ANCHORS.map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className={
                'rounded-lg px-3 py-2 text-sm font-medium text-violet-200/60 transition hover:bg-white/[0.04] hover:text-fuchsia-300 ' +
                LANDING_FOCUS
              }
            >
              {label}
            </a>
          ))}
          <div className="mx-1 h-5 w-px bg-white/[0.08]" aria-hidden />
          <Link to={ROUTES.LOGIN} className={NAV_LINK_SECONDARY + ' px-4'}>
            Log in
          </Link>
          <button type="button" onClick={handleGuestLogin} className={NAV_LINK_SECONDARY + ' px-4'}>
            Guest
          </button>
          <Link to={ROUTES.REGISTER} className={NAV_LINK_PRIMARY + ' px-5'}>
            Get started
          </Link>
        </nav>

        {/* Mobile actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to={ROUTES.REGISTER} className={NAV_LINK_PRIMARY + ' max-sm:min-h-[44px] px-3.5 py-2 text-xs sm:px-4 sm:text-sm'}>
            Get started
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className={
              'flex h-9 w-9 max-sm:h-11 max-sm:w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-[#0c0818]/60 text-violet-200/70 transition hover:border-fuchsia-500/30 hover:text-fuchsia-300 ' +
              LANDING_FOCUS
            }
            aria-expanded={menuOpen}
            aria-controls="landing-mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="landing-mobile-menu"
          className="border-t border-white/[0.06] bg-[#0c0818]/95 backdrop-blur-xl lg:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3" aria-label="Mobile">
            {NAV_ANCHORS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={closeMenu}
                className={
                  'rounded-xl px-3 py-2.5 text-sm font-medium text-violet-200/70 transition hover:bg-white/[0.04] hover:text-fuchsia-300 ' +
                  LANDING_FOCUS
                }
              >
                {label}
              </a>
            ))}
            <div className="my-2 h-px bg-white/[0.06]" />
            <Link to={ROUTES.LOGIN} onClick={closeMenu} className={NAV_LINK_SECONDARY + ' w-full max-sm:min-h-[44px]'}>
              Log in
            </Link>
            <button type="button" onClick={handleGuestLogin} className={NAV_LINK_SECONDARY + ' w-full max-sm:min-h-[44px]'}>
              Guest login
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
