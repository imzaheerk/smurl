import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { FeatureMiniVariant } from './LandingFeatureMiniScene';

gsap.registerPlugin(ScrollTrigger);

const LandingFeatureMiniScene = lazy(() =>
  import('./LandingFeatureMiniScene').then((m) => ({ default: m.LandingFeatureMiniScene }))
);

export interface FeatureChannelCardProps {
  variant: FeatureMiniVariant;
  label: string;
}

/** Redesigned channel tile: GSAP scroll entrance + pointer tilt; Three.js preview inside. */
export function FeatureChannelCard({ variant, label }: FeatureChannelCardProps) {
  const rootRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const tilt = tiltRef.current;
    const glow = glowRef.current;
    if (!root || !tilt) return;

    gsap.set(tilt, { transformPerspective: 920 });

    const xTo = gsap.quickTo(tilt, 'rotationY', { duration: 0.55, ease: 'power3.out' });
    const yTo = gsap.quickTo(tilt, 'rotationX', { duration: 0.55, ease: 'power3.out' });

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      xTo(px * -10);
      yTo(py * 7);
      if (glow) gsap.to(glow, { opacity: 0.55, duration: 0.25 });
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
      if (glow) gsap.to(glow, { opacity: 0, duration: 0.4 });
    };

    root.addEventListener('pointermove', onMove);
    root.addEventListener('pointerleave', onLeave);

    const tween = gsap.fromTo(
      root,
      { opacity: 0, y: 40, scale: 0.94 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom-=10%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <article
      ref={rootRef}
      className="group relative overflow-hidden rounded-2xl border border-slate-800/90 bg-slate-950/75 p-3 shadow-lg shadow-slate-950/60 will-change-transform"
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-teal-500/25 via-sky-500/10 to-violet-500/25 opacity-0 blur-md transition-opacity"
        aria-hidden
      />
      <div ref={tiltRef} className="relative origin-center [transform-style:preserve-3d]">
        <p className="relative z-[1] mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
          {label}
        </p>
        <div className="relative z-[1] overflow-hidden rounded-xl ring-1 ring-white/5">
          <Suspense
            fallback={<div className="h-[100px] animate-pulse bg-slate-900/50 md:h-[108px]" />}
          >
            <LandingFeatureMiniScene variant={variant} />
          </Suspense>
        </div>
      </div>
    </article>
  );
}
