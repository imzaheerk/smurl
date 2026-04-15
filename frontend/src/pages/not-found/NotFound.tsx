import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { ROUTES } from '../../constants/routes';

const NotFoundScene = lazy(() =>
  import('./NotFoundScene').then((m) => ({ default: m.NotFoundScene }))
);

export const NotFound = () => {
  const [searchParams] = useSearchParams();
  const fromShortLink = searchParams.get('from') === 'short';
  const rootRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-nf-reveal]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.75,
          ease: 'power2.out',
          stagger: 0.08
        }
      );
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={rootRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4 py-10 text-slate-50"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <Suspense fallback={<div className="absolute inset-0" />}>
          <NotFoundScene />
        </Suspense>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_5%,rgba(45,212,191,0.14),transparent)]" />
      </div>

      <div className="relative z-10 w-full max-w-xl">
        <div className="rounded-3xl border border-white/10 bg-slate-900/55 px-6 py-8 text-center shadow-[0_24px_80px_rgba(2,6,23,0.75)] backdrop-blur-xl sm:px-9 sm:py-10">
          <p
            data-nf-reveal
            className="mx-auto mb-2 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-teal-200"
          >
            Error 404
          </p>
          <p data-nf-reveal className="text-6xl font-bold tracking-tight text-slate-600 md:text-7xl">
            404
          </p>
          <h1 data-nf-reveal className="mt-4 text-2xl font-semibold text-slate-100 sm:text-3xl">
            {fromShortLink ? "This link isn't here anymore." : "Page not found."}
          </h1>
          <p data-nf-reveal className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-slate-400 sm:text-base">
            {fromShortLink
              ? "The short link may be invalid or expired."
              : "The page you're looking for doesn't exist or was moved."}
          </p>

          <div data-nf-reveal className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <Link
              to={ROUTES.HOME}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-teal-400/40 bg-teal-400/15 px-4 py-2.5 text-sm font-medium text-teal-100 transition hover:border-teal-300/70 hover:bg-teal-400/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Back to home
            </Link>
            {fromShortLink && (
              <Link
                to={ROUTES.SHORTEN_HASH}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/15 bg-white/[0.05] px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.09] focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                Create short link
              </Link>
            )}
          </div>

          <p data-nf-reveal className="mt-5 text-xs text-slate-500">
            Tip: check the URL for typos, or return to dashboard links.
          </p>
        </div>
      </div>
    </div>
  );
};
