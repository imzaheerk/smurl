import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface Props {
  children: ReactNode;
}

export const Layout = ({ children }: Props) => {
  const { logout } = useAuth(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 bg-grid">
      <header className="sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-br from-cyan-400 to-fuchsia-500 opacity-40 blur group-hover:opacity-60 transition-opacity" />
              <div className="relative w-9 h-9 rounded-xl bg-slate-900 border border-white/10 flex items-center justify-center">
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">S</span>
              </div>
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-100 group-hover:text-white transition-colors">Smurl</span>
          </Link>
          <nav className="flex items-center gap-2">
            <button
              onClick={logout}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-slate-200 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {children}
      </main>
    </div>
  );
};
