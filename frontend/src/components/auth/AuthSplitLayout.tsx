import { lazy, Suspense, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';
import { AppLogo } from '../AppLogo';
import { BackLink } from '../ui';
import type { AuthPanelMode } from './AuthPanelScene';

const AuthPanelScene = lazy(() =>
  import('./AuthPanelScene').then((m) => ({ default: m.AuthPanelScene }))
);

/** Split auth: 3D + story (left) · segmented control + glass form (right). Outlet = login/register forms. */
export function AuthSplitLayout() {
  const { pathname } = useLocation();
  const isRegister = pathname === ROUTES.REGISTER;
  const mode: AuthPanelMode = isRegister ? 'register' : 'login';

  useEffect(() => {
    const { documentElement: html, body } = document;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    html.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-20 flex max-h-dvh min-h-0 flex-col overflow-hidden bg-[#0a0514] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-fuchsia-600/12 blur-[90px]" />
        <div className="absolute -right-20 bottom-1/4 h-56 w-56 rounded-full bg-amber-500/10 blur-[80px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px'
          }}
        />
      </div>
      {isRegister && (
        <div
          className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_90%,rgba(251,191,36,0.08),transparent_55%)]"
          aria-hidden
        />
      )}

      <BackLink
        to={ROUTES.HOME}
        theme="fuchsia"
        className="absolute left-4 top-4 z-30 !mb-0"
      >
        <span aria-hidden>←</span> Home
      </BackLink>

      <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-6xl flex-1 flex-col px-4 pb-3 pt-14 sm:px-6 sm:pb-4 sm:pt-16 lg:px-10 lg:pb-6 lg:pt-14">
        <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_auto] gap-4 lg:grid-cols-2 lg:grid-rows-1 lg:items-stretch lg:gap-12 xl:gap-16">
          {/* 3D + narrative */}
          <div className="order-2 flex h-40 min-h-0 shrink-0 flex-col justify-center overflow-hidden max-[760px]:h-28 sm:h-44 lg:order-1 lg:h-auto lg:max-h-none lg:shrink lg:flex-1">
            <div className="relative mx-auto h-full min-h-0 w-full max-w-lg lg:max-w-none">
              <div
                className={`relative flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border shadow-2xl ${
                  isRegister
                    ? 'border-amber-500/25 shadow-amber-950/30'
                    : 'border-fuchsia-500/25 shadow-fuchsia-950/35'
                }`}
              >
                <div
                  className={`absolute -inset-px rounded-3xl opacity-70 blur-xl ${
                    isRegister
                      ? 'bg-gradient-to-br from-amber-500/35 via-fuchsia-500/15 to-violet-500/20'
                      : 'bg-gradient-to-tr from-fuchsia-500/40 via-pink-500/20 to-amber-400/25'
                  }`}
                  aria-hidden
                />
                <div className="relative min-h-0 flex-1 lg:min-h-[min(20rem,42dvh)]">
                  <Suspense
                    fallback={
                      <div className="absolute inset-0 animate-pulse rounded-[inherit] bg-slate-900/80" />
                    }
                  >
                    <AuthPanelScene mode={mode} />
                  </Suspense>
                  <div
                    className="pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-t from-[#0a0514]/92 via-[#0a0514]/30 to-transparent"
                    aria-hidden
                  />
                  <div className="absolute inset-x-0 bottom-0 z-[1] p-4 max-[760px]:hidden sm:p-6 lg:p-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={mode}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {isRegister ? (
                          <>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-300/90">
                              New workspace
                            </p>
                            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                              Create. Shorten. Measure.
                            </h2>
                            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm lg:mt-3">
                              Campaign-ready links, QR for print, and analytics that stay readable at a
                              glance — tuned for violet night mode.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-fuchsia-300/90">
                              Dashboard
                            </p>
                            <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl lg:text-3xl">
                              Clarity for every click.
                            </h2>
                            <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400 sm:text-sm lg:mt-3">
                              Pick up where you left off: folders, history, geo and device breakdowns,
                              and API keys — all behind one sign-in.
                            </p>
                          </>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="order-1 flex min-h-0 w-full flex-col justify-center overflow-hidden lg:order-2 lg:max-w-md lg:justify-self-end xl:max-w-lg">
            <AppLogo
              to={ROUTES.HOME}
              size="lg"
              className="mb-4 self-start max-[760px]:mb-2 sm:mb-5 lg:mb-6"
            />

            <div className="mb-4 flex shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 backdrop-blur-sm sm:mb-5">
              <NavLink
                to={ROUTES.LOGIN}
                end
                className={({ isActive }) =>
                  `relative flex-1 rounded-full py-2.5 text-center text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-fuchsia-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0514] ${
                    isActive ? 'text-white' : 'text-violet-400/50 hover:text-violet-200/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">Sign in</span>
                    {isActive ? (
                      <motion.span
                        layoutId="auth-tab-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.14] shadow-inner shadow-black/40"
                        aria-hidden
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
              <NavLink
                to={ROUTES.REGISTER}
                className={({ isActive }) =>
                  `relative flex-1 rounded-full py-2.5 text-center text-sm font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-amber-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0514] ${
                    isActive ? 'text-white' : 'text-violet-400/50 hover:text-violet-200/80'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">Create account</span>
                    {isActive ? (
                      <motion.span
                        layoutId="auth-tab-pill"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        className="absolute inset-0 -z-10 rounded-full bg-white/[0.14] shadow-inner shadow-black/40"
                        aria-hidden
                      />
                    ) : null}
                  </>
                )}
              </NavLink>
            </div>

            <div className="relative max-h-full min-h-0 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0c0818]/70 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl">
              <div
                className={`h-1 w-full bg-gradient-to-r ${
                  isRegister
                    ? 'from-amber-400/90 via-fuchsia-400/70 to-pink-400/80'
                    : 'from-fuchsia-400/90 via-pink-400/70 to-amber-400/80'
                }`}
                aria-hidden
              />
              <div className="auth-scroll min-h-0 max-h-[min(100%,calc(100dvh-11rem))] overflow-y-auto px-5 py-4 sm:px-6 sm:py-5 lg:px-7 lg:py-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pathname}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                  >
                    <Outlet />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            <p className="mt-3 shrink-0 text-center text-[11px] text-slate-600 max-[760px]:hidden lg:mt-4">
              Encrypted connection · Your data stays yours
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
