import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LANDING_CARD } from '../constants/theme';
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

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    gsap.set(tilt, { transformPerspective: 920 });

    let onMove: ((e: PointerEvent) => void) | undefined;
    let onLeave: (() => void) | undefined;

    if (!prefersReducedMotion) {
      const xTo = gsap.quickTo(tilt, 'rotationY', { duration: 0.55, ease: 'power3.out' });
      const yTo = gsap.quickTo(tilt, 'rotationX', { duration: 0.55, ease: 'power3.out' });

      onMove = (e: PointerEvent) => {
        const r = root.getBoundingClientRect();
        const px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        const py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        xTo(px * -10);
        yTo(py * 7);
        if (glow) gsap.to(glow, { opacity: 0.55, duration: 0.25 });
      };
      onLeave = () => {
        xTo(0);
        yTo(0);
        if (glow) gsap.to(glow, { opacity: 0, duration: 0.4 });
      };

      root.addEventListener('pointermove', onMove);
      root.addEventListener('pointerleave', onLeave);
    }

    const tween = prefersReducedMotion
      ? gsap.set(root, { opacity: 1, y: 0, scale: 1 })
      : gsap.fromTo(
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
      if ('scrollTrigger' in tween && tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
      if (onMove) root.removeEventListener('pointermove', onMove);
      if (onLeave) root.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return (
    <article
      ref={rootRef}
      className={'group relative overflow-hidden p-3 shadow-lg shadow-black/30 will-change-transform ' + LANDING_CARD}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-fuchsia-500/25 via-violet-500/10 to-amber-500/20 opacity-0 blur-md transition-opacity"
        aria-hidden
      />
      <div ref={tiltRef} className="relative origin-center [transform-style:preserve-3d]">
        <p className="relative z-[1] mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400/50">
          {label}
        </p>
        <div className="relative z-[1] overflow-hidden rounded-xl ring-1 ring-white/5">
          <Suspense
            fallback={<div className="h-[100px] animate-pulse bg-violet-950/30 md:h-[108px]" />}
          >
            <LandingFeatureMiniScene variant={variant} />
          </Suspense>
        </div>
      </div>
    </article>
  );
}
