import { type ReactNode, useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
}

/** Wrapper that reveals children when they scroll into view. */
export function ScrollReveal({ children, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform-gpu transition-all duration-700 ease-out ${
        visible
          ? 'opacity-100 translate-y-0 scale-100 rotate-0'
          : 'opacity-0 translate-y-8 scale-95 rotate-[1.5deg]'
      }`}
    >
      {children}
    </div>
  );
}
