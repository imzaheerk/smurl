import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { SmurlBrand } from './AppLogo';
import { LANDING_SECTION_LABEL } from './app/appTheme';

const SplashScene = lazy(() =>
  import('./SplashScene').then((m) => ({ default: m.SplashScene }))
);

const SPLASH_DURATION_MS = 1800;
const SPLASH_FADE_DELAY_MS = 400;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = reduced ? 900 : SPLASH_DURATION_MS;
    const t = setTimeout(() => setVisible(false), duration);
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-splash-reveal]',
        { autoAlpha: 0, y: 14 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          stagger: 0.08
        }
      );
      gsap.fromTo(
        '[data-splash-bar]',
        { scaleX: 0.06, transformOrigin: 'left center' },
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
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0a0514] px-5"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          role="status"
          aria-live="polite"
          aria-label="Loading Smurl"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-fuchsia-600/12 blur-[100px]" />
            <div className="absolute -right-24 bottom-1/4 h-64 w-64 rounded-full bg-amber-500/10 blur-[90px]" />
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage:
                  'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '52px 52px'
              }}
            />
            <Suspense fallback={null}>
              <SplashScene />
            </Suspense>
          </div>

          <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c0818]/80 shadow-[0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:max-w-md">
            <div
              className="h-0.5 w-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
              aria-hidden
            />
            <div className="px-6 py-8 text-center sm:px-8 sm:py-9">
              <div data-splash-reveal className="flex justify-center">
                <SmurlBrand size="xl" layout="vertical" />
              </div>

              <p data-splash-reveal className={'mt-5 ' + LANDING_SECTION_LABEL}>
                Loading workspace
              </p>
              <p data-splash-reveal className="mt-1.5 text-sm text-violet-200/45">
                Short links, analytics &amp; QR
              </p>

              <div data-splash-reveal className="mt-7">
                <div className="h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <div
                    data-splash-bar
                    className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400 shadow-[0_0_16px_rgba(232,121,249,0.35)]"
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-violet-400/40">
                  <span>Starting up</span>
                  <span>Almost ready</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
