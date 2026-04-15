import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';

const SplashScene = lazy(() =>
  import('./SplashScene').then((m) => ({ default: m.SplashScene }))
);

const SPLASH_DURATION_MS = 1700;
const SPLASH_FADE_DELAY_MS = 380;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), SPLASH_DURATION_MS);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!visible) {
      const t = setTimeout(onComplete, SPLASH_FADE_DELAY_MS);
      return () => clearTimeout(t);
    }
  }, [visible, onComplete]);

  useLayoutEffect(() => {
    if (!visible || !rootRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-splash-reveal]',
        { autoAlpha: 0, y: 18 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power2.out',
          stagger: 0.08
        }
      );
      gsap.fromTo(
        '[data-splash-bar]',
        { scaleX: 0.1, transformOrigin: 'left center' },
        {
          scaleX: 1,
          duration: SPLASH_DURATION_MS / 1000,
          ease: 'power1.inOut'
        }
      );
    }, rootRef);
    return () => ctx.revert();
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          ref={rootRef}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-grid bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-900/95 px-5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <Suspense fallback={<div className="absolute inset-0" />}>
              <SplashScene />
            </Suspense>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_35%_at_50%_6%,rgba(45,212,191,0.16),transparent)]" />
          </div>

          <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-slate-900/45 px-6 py-7 text-center shadow-[0_24px_80px_rgba(2,6,23,0.7)] backdrop-blur-xl sm:px-8 sm:py-8">
            <div
              data-splash-reveal
              className="mx-auto mb-3 inline-flex rounded-full border border-teal-400/30 bg-teal-400/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-teal-200"
            >
              Smurl
            </div>
            <h1 data-splash-reveal className="text-2xl font-semibold tracking-tight text-slate-100 sm:text-3xl">
              Preparing your workspace
            </h1>
            <p data-splash-reveal className="mt-2 text-sm text-slate-400">
              Loading links, analytics, and dashboard modules.
            </p>
            <div data-splash-reveal className="mt-6">
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.08]">
                <div
                  data-splash-bar
                  className="h-full rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-violet-400 shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                <span>Boot sequence</span>
                <span>almost ready</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
