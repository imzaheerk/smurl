import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SPLASH_DURATION_MS = 1500;
const SPLASH_FADE_DELAY_MS = 400;

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

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

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-grid bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-900/95"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        >
          {/* Soft orbs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
            <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-500/15 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
            <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-sky-500/12 blur-[90px] animate-[pulse_7s_ease-in-out_infinite]" />
            <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px] animate-[pulse_9s_ease-in-out_infinite]" />
          </div>

          {/* Logo with glow and smooth entrance */}
          <motion.div
            className="relative z-10"
            initial={{ opacity: 0, scale: 0.85, y: 8 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            <div
              className="absolute inset-0 -m-8 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 blur-2xl"
              aria-hidden
            />
            <motion.img
              src="/logo.png"
              alt="Smurl"
              className="relative h-[min(36vw,220px)] w-auto object-contain drop-shadow-[0_0_50px_rgba(34,211,238,0.15)]"
              animate={{
                filter: [
                  'drop-shadow(0 0 50px rgba(34,211,238,0.15))',
                  'drop-shadow(0 0 60px rgba(192,132,252,0.2))',
                  'drop-shadow(0 0 50px rgba(34,211,238,0.15))',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>

          {/* Dual-ring spinner with gradient and glow */}
          <div className="relative z-10 flex flex-col items-center gap-4">
            <div className="relative h-28 w-28">
              {/* Outer ring - cyan/fuchsia gradient, rotates clockwise */}
              <motion.div
                className="absolute inset-0 rounded-full border-[3px] border-transparent"
                style={{
                  borderTopColor: 'rgb(34, 211, 238)',
                  borderRightColor: 'rgb(192, 132, 252)',
                  borderBottomColor: 'rgba(34, 211, 238, 0.2)',
                  borderLeftColor: 'rgba(192, 132, 252, 0.2)',
                  boxShadow: '0 0 25px rgba(34, 211, 238, 0.25), 0 0 40px rgba(192, 132, 252, 0.15)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              />
              {/* Inner ring - opposite direction, softer */}
              <motion.div
                className="absolute inset-3 rounded-full border-2 border-transparent"
                style={{
                  borderTopColor: 'rgba(192, 132, 252, 0.6)',
                  borderLeftColor: 'rgba(34, 211, 238, 0.6)',
                  borderRightColor: 'transparent',
                  borderBottomColor: 'transparent',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
            <motion.p
              className="text-xs font-medium tracking-[0.2em] uppercase text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              Loading
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
