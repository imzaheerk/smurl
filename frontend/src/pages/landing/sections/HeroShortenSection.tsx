import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowRight, Zap } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES } from '../../../constants/routes';
import {
  LANDING_BTN_GHOST,
  LANDING_BTN_PRIMARY,
  LANDING_BTN_SECONDARY,
  LANDING_FOCUS
} from '../constants/theme';

gsap.registerPlugin(ScrollTrigger);

const LandingHeroScene = lazy(() =>
  import('../components/LandingHeroScene').then((m) => ({ default: m.LandingHeroScene }))
);

const STATS = [
  { value: '<50ms', label: 'Redirect speed' },
  { value: 'Free', label: 'No card needed' },
  { value: 'QR + API', label: 'Built in' }
] as const;

export interface HeroShortenSectionProps {
  url: string;
  setUrl: (value: string) => void;
  shortUrl: string | null;
  loading: boolean;
  copied: boolean;
  handleSubmit: (e: React.FormEvent) => void;
  copyToClipboard: () => void;
  downloadQR: () => void;
}

export function HeroShortenSection({
  url,
  setUrl,
  shortUrl,
  loading,
  copied,
  handleSubmit,
  copyToClipboard,
  downloadQR
}: HeroShortenSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const parallaxColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const headlineLines = headlineRef.current?.querySelectorAll<HTMLElement>('[data-hero-line]');
    const statItems = statsRef.current?.querySelectorAll('[data-stat]');

    if (prefersReducedMotion) {
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (badgeRef.current) {
        tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6 }, 0);
      }
      if (headlineLines?.length) {
        tl.from(headlineLines, { y: 52, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.06);
      }
      if (subRef.current) {
        tl.from(subRef.current, { y: 24, opacity: 0, duration: 0.7 }, 0.32);
      }
      if (statItems?.length) {
        tl.from(statItems, { y: 20, opacity: 0, scale: 0.92, duration: 0.55, stagger: 0.08 }, 0.42);
      }
      if (formRef.current) {
        tl.from(formRef.current, { y: 48, opacity: 0, scale: 0.95, duration: 0.9, ease: 'power2.out' }, 0.22);
      }
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const col = parallaxColRef.current;
    if (!root || !col) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const tween = gsap.fromTo(
      col,
      { y: 0 },
      {
        y: -28,
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.65
        }
      }
    );

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      id="shorten"
      className="relative -mx-4 mb-20 max-sm:min-h-0 scroll-mt-20 overflow-hidden rounded-b-3xl min-h-[88vh] md:-mx-6 md:mb-28 lg:min-h-[92vh]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0514] via-[#0d0820] to-[#120a28]" aria-hidden />

      <div className="absolute inset-y-0 right-0 w-full lg:w-[62%]">
        <Suspense fallback={<div className="absolute inset-0 bg-[#0c0818]/40" aria-hidden />}>
          <LandingHeroScene scrollRootRef={rootRef} />
        </Suspense>
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0514]/90 via-[#0a0514]/70 to-[#0a0514]/50 lg:bg-gradient-to-l lg:from-transparent lg:via-[#0a0514]/20 lg:to-[#0a0514]/75"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_70%_40%,rgba(232,121,249,0.14),transparent)]"
          aria-hidden
        />
      </div>

      <div className="relative z-10 grid grid-cols-1 items-center gap-10 max-sm:gap-6 max-sm:py-12 px-5 py-16 md:px-8 md:py-20 lg:grid-cols-12 lg:gap-12 lg:py-24">
        <div
          ref={parallaxColRef}
          className="flex flex-col justify-center max-sm:order-2 lg:col-span-7 will-change-transform"
        >
          <div ref={badgeRef} className="relative mb-5 inline-flex w-fit">
            <span
              className="hero-badge-glow pointer-events-none absolute -inset-2 rounded-full bg-gradient-to-r from-fuchsia-500/35 via-pink-500/20 to-amber-400/30 blur-md"
              aria-hidden
            />
            <div className="hero-badge-border relative rounded-full p-px">
              <div className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.06] bg-[#0a0514]/80 px-3.5 py-1.5 backdrop-blur-md">
                <span className="relative flex h-5 w-5 shrink-0 items-center justify-center" aria-hidden>
                  <span className="absolute inset-0 rounded-full bg-amber-400/25 animate-ping motion-reduce:animate-none" />
                  <Zap className="relative h-3 w-3 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.75)]" />
                </span>
                <span className="hero-badge-text max-sm:text-[10px] max-sm:tracking-[0.16em] text-[11px] font-semibold uppercase tracking-[0.22em] text-transparent">
                  Link infrastructure
                </span>
              </div>
            </div>
          </div>

          <h1
            ref={headlineRef}
            className="max-sm:text-[2rem] max-sm:leading-[1.1] text-[2.5rem] font-bold leading-[1.06] tracking-tight sm:text-5xl lg:text-[3.5rem] xl:text-[3.75rem]"
          >
            <span
              data-hero-line
              className="block bg-gradient-to-r from-fuchsia-300 via-pink-300 to-amber-300 bg-clip-text text-transparent"
            >
              Every link,
            </span>
            <span data-hero-line className="mt-1 block text-white/95">
              beautifully short.
            </span>
            <span
              data-hero-line
              className="mt-1 block bg-gradient-to-r from-violet-300 via-fuchsia-400 to-amber-400 bg-clip-text text-transparent"
            >
              Powerfully tracked.
            </span>
          </h1>

          <p
            ref={subRef}
            className="mt-6 max-w-lg text-base leading-relaxed text-violet-200/55 md:text-lg"
          >
            Smurl turns long URLs into crisp short links and QR codes — with click intelligence
            when you&apos;re ready to go deeper.
          </p>

          <ul className="mt-6 max-w-lg space-y-2 text-sm text-violet-200/60" role="list">
            {[
              'Instant shortening — try it without signing up',
              'Print-ready QR codes and one-tap copy',
              'Geo, device, and referrer analytics for signed-in users',
              'Bearer API keys for servers and automation'
            ].map((text) => (
              <li key={text} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-400 to-amber-400 shadow-[0_0_8px_rgba(232,121,249,0.6)]"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <div ref={statsRef} className="mt-8 flex flex-wrap gap-3">
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                data-stat
                className="rounded-2xl border border-white/[0.06] bg-white/[0.03] px-4 py-3 backdrop-blur-sm"
              >
                <p className="text-lg font-bold text-amber-300">{value}</p>
                <p className="text-[11px] text-violet-300/50">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center max-sm:order-1 lg:col-span-5">
          <div ref={formRef} className="relative w-full">
            <div
              className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-fuchsia-500/40 via-violet-500/20 to-amber-500/30 opacity-70 blur-lg"
              aria-hidden
            />
            <div className="relative rounded-[1.75rem] border border-white/[0.08] bg-[#0c0818]/85 p-6 shadow-[0_32px_90px_rgba(0,0,0,0.55)] backdrop-blur-2xl max-sm:p-5 md:p-7">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-violet-400/60">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-400" aria-hidden />
                Try it now
              </div>
              <h2 className="mb-5 text-lg font-semibold text-white">Paste a URL — get a short link</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="landing-url" className="mb-1.5 block text-xs font-medium text-violet-200/70">
                    Long URL
                  </label>
                  <input
                    id="landing-url"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your/campaign/link"
                    className="w-full rounded-xl border border-white/[0.08] bg-[#0a0514]/80 px-3.5 py-2.5 text-sm text-white placeholder:text-violet-400/35 transition focus:border-fuchsia-400/50 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50"
                    autoComplete="url"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={LANDING_BTN_PRIMARY + ' w-full'}
                >
                  {loading ? 'Shortening…' : 'Shorten URL'}
                  {!loading && <ArrowRight className="h-4 w-4" aria-hidden />}
                </button>
              </form>

              {shortUrl && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0a0514]/70 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span
                      className="min-w-0 select-text break-all text-xs text-violet-100 md:text-sm"
                      title={shortUrl}
                    >
                      {shortUrl}
                    </span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className={LANDING_BTN_SECONDARY + ' min-h-[44px] shrink-0 px-4 py-2.5 text-xs sm:py-1.5'}
                      aria-label={copied ? 'Copied' : 'Copy link'}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-white/[0.08] bg-[#0a0514]/70 p-3">
                      <QRCodeCanvas id="smurl-qr" value={shortUrl} size={96} bgColor="#0a0514" fgColor="#f5d0fe" />
                    </div>
                    <div className="space-y-1 text-xs text-violet-300/55">
                      <p className="font-medium text-violet-100">QR code ready</p>
                      <p>Scan on mobile or export for print layouts.</p>
                      <button
                        type="button"
                        onClick={downloadQR}
                        className={LANDING_BTN_GHOST + ' mt-1 max-sm:min-h-[44px] px-3 py-1.5 text-xs max-sm:py-2.5'}
                      >
                        Download PNG
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {!shortUrl && (
                <p className="mt-5 text-xs text-violet-400/50">
                  Need history, domains, and team tools?{' '}
                  <Link
                    to={ROUTES.REGISTER}
                    className={
                      'text-fuchsia-400 underline-offset-2 hover:underline rounded ' + LANDING_FOCUS
                    }
                  >
                    Create a free account
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
