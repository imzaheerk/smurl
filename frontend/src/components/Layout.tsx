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
          <Link to="/dashboard" className="flex items-center gap-3 group cursor-pointer" style={{ perspective: '1000px' }}>
            <div className="relative" style={{
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }} 
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'rotateX(10deg) rotateY(-10deg) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            }}
            >
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-red-400 to-red-500 opacity-40 blur group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-red-500/20 via-red-500/20 to-red-500/20 blur-lg opacity-40 transition-opacity duration-500" style={{
                animation: 'fogBlow 3s ease-in-out infinite',
              }} />
              {/* Red fog effect */}
              <div className="absolute -inset-3 rounded-xl opacity-60 pointer-events-none" style={{
                filter: 'blur(16px)',
                animation: 'fogDrift 4s ease-in-out infinite',
                background: 'radial-gradient(ellipse at 30% 50%, rgba(220, 38, 38, 0.4), transparent 70%)',
              }} />
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-red-400/50 flex items-center justify-center shadow-lg shadow-red-500/50 group-hover:shadow-red-400/80 transition-all" style={{
                animation: 'float 3s ease-in-out infinite',
              }}>
                <span className="text-sm font-bold bg-gradient-to-r from-red-300 via-red-400 to-red-300 bg-clip-text text-transparent animate-pulse">S</span>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-white group-hover:bg-gradient-to-r group-hover:from-red-400 group-hover:via-cyan-300 group-hover:to-red-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500 relative" style={{
              textShadow: 'none',
            }}>
              {/* Blowing red fog effect */}
              <span className="absolute inset-0 rounded-md opacity-100 transition-opacity duration-500" style={{
                filter: 'blur(8px)',
                animation: 'fogBlow 3s ease-in-out infinite',
              }}>
                <span className="absolute inset-0 bg-gradient-to-r from-red-600/40 via-red-500/30 to-red-600/40" style={{
                  animation: 'windBlow 2.5s ease-in-out infinite',
                }} />
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" style={{
                  animation: 'windBlowReverse 3s ease-in-out infinite',
                }} />
              </span>
              {/* Additional fog layers for depth */}
              <span className="absolute -inset-3 rounded-md opacity-60 transition-opacity duration-700 pointer-events-none" style={{
                filter: 'blur(16px)',
                animation: 'fogDrift 4s ease-in-out infinite',
                background: 'radial-gradient(ellipse at 30% 50%, rgba(220, 38, 38, 0.3), transparent 70%)',
              }} />
              <span className="relative z-10">Smurl</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2">
            <button
              onClick={openConfirm}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
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
