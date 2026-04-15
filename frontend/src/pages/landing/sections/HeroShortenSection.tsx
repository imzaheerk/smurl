import { lazy, Suspense, useLayoutEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ROUTES } from '../../../constants/routes';
import { Button } from '../../../components/ui';

gsap.registerPlugin(ScrollTrigger);

const LandingHeroScene = lazy(() =>
  import('../components/LandingHeroScene').then((m) => ({ default: m.LandingHeroScene }))
);

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
  const badgeRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const decoRef = useRef<HTMLDivElement>(null);
  const parallaxColRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const headlineLines = headlineRef.current?.querySelectorAll<HTMLElement>('[data-hero-line]');
    const listItems = listRef.current?.querySelectorAll('li');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      if (badgeRef.current) {
        tl.from(badgeRef.current, { y: 24, opacity: 0, duration: 0.65 }, 0);
      }
      if (headlineLines?.length) {
        tl.from(
          headlineLines,
          { y: 48, opacity: 0, rotateX: -12, duration: 0.85, stagger: 0.11 },
          0.08
        );
      }
      if (subRef.current) {
        tl.from(subRef.current, { y: 28, opacity: 0, duration: 0.75 }, 0.35);
      }
      if (listItems?.length) {
        tl.from(listItems, { x: -16, opacity: 0, duration: 0.5, stagger: 0.07 }, 0.45);
      }
      if (decoRef.current) {
        tl.from(decoRef.current, { scaleX: 0, opacity: 0, duration: 0.9, transformOrigin: 'left center' }, 0.2);
      }
      if (formRef.current) {
        tl.from(
          formRef.current,
          { y: 56, opacity: 0, scale: 0.96, duration: 0.95, ease: 'power2.out' },
          0.25
        );
      }
    }, root);

    return () => ctx.revert();
  }, []);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const col = parallaxColRef.current;
    if (!root || !col) return;

    const tween = gsap.fromTo(
      col,
      { y: 0 },
      {
        y: -36,
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
      className="relative mb-24 scroll-mt-24 overflow-hidden rounded-[2rem] border border-slate-800/60 bg-slate-950/40 shadow-[0_0_0_1px_rgba(15,23,42,0.8)] md:mb-28"
    >
      <Suspense fallback={null}>
        <LandingHeroScene scrollRootRef={rootRef} />
      </Suspense>
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/75 to-slate-950"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(45,212,191,0.18),transparent)]" aria-hidden />

      <div className="relative z-10 grid grid-cols-1 gap-12 px-5 py-14 md:grid-cols-12 md:gap-10 md:px-10 md:py-16 lg:gap-14 lg:py-20">
        <div
          ref={parallaxColRef}
          className="md:col-span-6 lg:col-span-7 flex flex-col justify-center perspective-[1200px] will-change-transform"
        >
          <div ref={decoRef} className="mb-5 h-px w-16 rounded-full bg-gradient-to-r from-teal-400 via-cyan-400 to-transparent opacity-90" aria-hidden />
          <p
            ref={badgeRef}
            className="mb-4 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-300/90"
          >
            Link infrastructure · analytics · QR
          </p>
          <h1
            ref={headlineRef}
            className="text-[2.35rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.25rem]"
          >
            <span
              data-hero-line
              className="block bg-gradient-to-r from-teal-200 via-cyan-200 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(45,212,191,0.2)]"
            >
              Shorten in one beat.
            </span>
            <span data-hero-line className="mt-1 block text-slate-100">
              Share with confidence.
            </span>
            <span
              data-hero-line
              className="mt-1 block bg-gradient-to-r from-sky-300 via-teal-300 to-violet-300 bg-clip-text text-transparent"
            >
              Track what matters.
            </span>
          </h1>
          <p
            ref={subRef}
            className="mt-6 max-w-xl text-base leading-relaxed text-slate-400 md:text-lg"
          >
            Smurl compresses noisy URLs into memorable short links, pairs them with crisp QR codes,
            and surfaces click intelligence when you are ready to go deeper.
          </p>
          <ul ref={listRef} className="mt-8 max-w-lg space-y-2.5 text-sm text-slate-300" role="list">
            {[
              'Instant shortening — try it without signing up',
              'Print‑ready QR and one‑tap copy for campaigns',
              'Geo, device, and referrer analytics for signed‑in users',
              'Bearer API keys for servers and automation'
            ].map((text) => (
              <li key={text} className="flex items-start gap-2.5">
                <span
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-teal-400 to-cyan-400 shadow-[0_0_10px_rgba(45,212,191,0.7)]"
                  aria-hidden
                />
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-6 lg:col-span-5 flex items-center">
          <div ref={formRef} className="relative w-full">
            <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-br from-teal-500/35 via-sky-500/15 to-violet-500/35 opacity-80 blur-md" aria-hidden />
            <div className="relative rounded-3xl border border-slate-700/90 bg-slate-950/80 p-6 shadow-[0_28px_80px_rgba(2,6,23,0.85)] backdrop-blur-xl md:p-7">
              <div className="mb-1 flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" aria-hidden />
                Live playground
              </div>
              <h2 className="mb-5 text-lg font-semibold text-slate-50">Paste a URL — get a short link</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="landing-url" className="mb-1.5 block text-xs font-medium text-slate-300">
                    Long URL
                  </label>
                  <input
                    id="landing-url"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your/campaign/link"
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-teal-400/50 focus:outline-none focus:ring-2 focus:ring-teal-500/60"
                    autoComplete="url"
                  />
                </div>
                <Button type="submit" variant="primaryViolet" fullWidth disabled={loading}>
                  {loading ? 'Shortening…' : 'Shorten URL'}
                </Button>
              </form>

              {shortUrl && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-slate-900/90 px-3.5 py-3 sm:flex-row sm:items-center sm:justify-between">
                    <span
                      className="min-w-0 select-text break-all text-xs text-slate-200 md:text-sm"
                      title={shortUrl}
                    >
                      {shortUrl}
                    </span>
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={copyToClipboard}
                      className="min-h-[44px] shrink-0 px-4 py-2.5 text-xs sm:py-1.5"
                      aria-label={copied ? 'Copied' : 'Copy link'}
                    >
                      {copied ? 'Copied!' : 'Copy'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl border border-slate-800 bg-slate-900/90 p-3">
                      <QRCodeCanvas id="smurl-qr" value={shortUrl} size={96} bgColor="#020617" fgColor="#e5e7eb" />
                    </div>
                    <div className="space-y-1 text-xs text-slate-400">
                      <p className="font-medium text-slate-200">QR code ready</p>
                      <p>Scan on mobile or export for print layouts.</p>
                      <Button
                        type="button"
                        variant="secondaryGray"
                        onClick={downloadQR}
                        className="mt-1 px-3 py-1.5 text-xs"
                      >
                        Download PNG
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {!shortUrl && (
                <p className="mt-5 text-xs text-slate-500">
                  Need history, domains, and team tools?{' '}
                  <Link
                    to={ROUTES.REGISTER}
                    className="text-teal-400 underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded"
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
