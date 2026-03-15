import { type ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';
import { LogoutConfirmModal } from './LogoutConfirmModal';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../constants/routes';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { logout } = useAuth(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const handleLogout = () => {
    logout();
    closeConfirm();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 bg-grid">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg relative">
            {/* Red fade glow behind logo */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-red-500/40 blur-lg pointer-events-none" style={{ animation: 'red-fade-glow 4s ease-in-out infinite' }} aria-hidden />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.35), transparent 70%)', filter: 'blur(12px)', animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
            <div
              className="relative w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-teal-400/80 group-hover:bg-teal-500/20 shrink-0 shadow-lg shadow-red-500/20"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <span className="text-sm font-bold text-teal-400">S</span>
            </div>
            {/* Red fade around signature */}
            <span className="relative inline-block">
              <span className="absolute -inset-1 rounded-md bg-gradient-to-r from-red-500/25 via-red-400/15 to-red-500/25 blur-sm opacity-80 group-hover:opacity-100 transition-opacity" style={{ animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
              <span className="relative text-xl font-semibold text-teal-300/90 group-hover:text-teal-200 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>Smurl</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2" aria-label="Main navigation">
            <Link
              to={ROUTES.SETTINGS}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Settings
            </Link>
            <Button
              type="button"
              variant="secondary"
              onClick={openConfirm}
              className="!text-sm !px-4 !py-2.5 sm:!px-5 sm:!py-2.5 !rounded-xl !bg-gradient-to-r !from-cyan-500/20 !to-red-500/20 !border-cyan-500/30 !text-cyan-300 hover:!from-cyan-500/25 hover:!to-red-500/25 hover:!border-cyan-400/50"
            >
              Logout
            </Button>
          </nav>

          <LogoutConfirmModal open={confirmOpen} onClose={closeConfirm} onConfirm={handleLogout} />
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};
