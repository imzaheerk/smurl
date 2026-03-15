import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { FOCUS_RING_TEAL } from '../../../constants/styles';
import { isDemoLoginEnabled } from '../../login/hooks/useLogin';

const NAV_LINK_SECONDARY =
  'flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950';
const NAV_LINK_PRIMARY =
  'flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-teal-300 text-slate-950 shadow-[0_18px_45px_rgba(124,58,237,0.65)] hover:brightness-110 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900';

export function LandingHeader() {
  return (
    <header className="relative sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
        <Link to={ROUTES.HOME} className={'flex items-center gap-2.5 group rounded-lg relative ' + FOCUS_RING_TEAL}>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-red-500/40 blur-lg pointer-events-none" style={{ animation: 'red-fade-glow 4s ease-in-out infinite' }} aria-hidden />
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.35), transparent 70%)', filter: 'blur(12px)', animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
          <div
            className="relative w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-teal-400/80 group-hover:bg-teal-500/20 shrink-0 shadow-lg shadow-red-500/20"
            style={{ animation: 'float 3s ease-in-out infinite' }}
          >
            <span className="text-sm font-bold text-teal-400">S</span>
          </div>
          <span className="relative inline-block">
            <span className="absolute -inset-1 rounded-md bg-gradient-to-r from-red-500/25 via-red-400/15 to-red-500/25 blur-sm opacity-80 group-hover:opacity-100 transition-opacity" style={{ animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
            <span className="relative text-xl font-semibold text-teal-300/90 group-hover:text-teal-200 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>Smurl</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 text-sm" aria-label="Account">
          <Link to={ROUTES.LOGIN} className={NAV_LINK_SECONDARY}>
            Log in
          </Link>
          {isDemoLoginEnabled && (
            <Link to={ROUTES.LOGIN} className={'hidden sm:flex ' + NAV_LINK_SECONDARY}>
              Demo login
            </Link>
          )}
          <Link to={ROUTES.REGISTER} className={NAV_LINK_PRIMARY}>
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
