import { type ReactNode, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

/** Scroll-driven reveal using GSAP ScrollTrigger. */
export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tween = gsap.fromTo(
      el,
      { opacity: 0, y: 44, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.82,
        delay: delay / 1000,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom-=10%',
          toggleActions: 'play none none none'
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  return (
    <div ref={ref} className="transform-gpu will-change-transform">
      {children}
    </div>
  );
}
