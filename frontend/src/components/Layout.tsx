import { ReactNode, useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout } = useAuth(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const openConfirm = () => setConfirmOpen(true);
  const closeConfirm = () => setConfirmOpen(false);
  const handleLogout = () => {
    closeConfirm();
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 bg-grid">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <Link to="/dashboard" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg relative">
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
          <nav className="flex items-center gap-2">
            <Link
              to="/settings"
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Settings
            </Link>
            <button
              onClick={openConfirm}
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Logout
            </button>
          </nav>

          {/* logout confirmation modal */}
          <Dialog open={confirmOpen} onClose={closeConfirm} className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ perspective: '1000px' }}>
            <div 
              className={`fixed inset-0 bg-black/60 transition-opacity duration-300 ${
                confirmOpen ? 'opacity-100' : 'opacity-0'
              }`}
              aria-hidden="true" 
            />
            <Dialog.Panel 
              className={`relative max-w-sm w-full bg-slate-900 rounded-2xl p-6 shadow-2xl border border-red-500/20 transform transition-all duration-500 ${
                confirmOpen
                  ? 'scale-100 opacity-100 translate-y-0 rotate-y-0'
                  : 'scale-95 opacity-0 translate-y-4 rotate-y-12'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                transform: confirmOpen 
                  ? 'rotateX(0deg) rotateY(0deg) scale(1)'
                  : 'rotateX(10deg) rotateY(5deg) scale(0.95)'
              }}
            >
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-br from-red-500/20 via-transparent to-red-500/10 rounded-2xl blur-xl -z-10" />
              
              <div className="flex items-center gap-3">
                <div className="relative">
                  <ExclamationTriangleIcon 
                    className="h-6 w-6 text-red-400 animate-bounce" 
                    style={{
                      animation: 'bounce 1s infinite, spin 3s linear infinite',
                    }}
                  />
                </div>
                <Dialog.Title className="text-lg font-semibold text-white">
                  Confirm logout
                </Dialog.Title>
              </div>
              <Dialog.Description className="mt-2 text-sm text-slate-300">
                Are you sure you want to log out?
              </Dialog.Description>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={closeConfirm}
                  className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-600 hover:scale-105 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-500 text-sm font-medium text-white hover:from-red-500 hover:to-red-400 hover:scale-105 hover:shadow-lg hover:shadow-red-500/50 transition-all"
                >
                  Yes, logout
                </button>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};
