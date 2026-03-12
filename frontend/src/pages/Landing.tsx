import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import api from '../services/api';

interface ShortenResponse {
  shortUrl: string;
  id: string;
}

const ScrollReveal = ({ children, delay = 0 }: { children: ReactNode; delay?: number }) => {
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
};

export const Landing = () => {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<ShortenResponse>('/public/shorten', { url });
      setShortUrl(res.data.shortUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
  };

  const downloadQR = () => {
    if (!shortUrl) return;
    const canvas = document.getElementById('smurl-qr') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'smurl-qrcode.png';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-teal-500/10 border border-teal-400/60 flex items-center justify-center">
              <span className="text-sm font-semibold text-teal-400">S</span>
            </div>
            <span className="text-lg font-semibold">Smurl</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Link
              to="/login"
              className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-teal-400 hover:text-teal-300"
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="px-3 py-1.5 rounded-lg bg-teal-500 text-slate-950 font-medium hover:bg-teal-400"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 md:py-16">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-16">
          <div className="space-y-6">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Shorten links, share anywhere, track everything.
            </h1>
            <p className="text-sm md:text-base text-slate-400 mb-5 max-w-xl">
              Smurl turns long, messy URLs into clean short links with built‑in analytics and QR
              codes. Perfect for campaigns, social, and print.
            </p>
            <ul className="text-sm text-slate-300 space-y-1.5 mb-6">
              <li>• One‑click URL shortening</li>
              <li>• QR codes ready for print or sharing</li>
              <li>• Detailed analytics once you create an account</li>
            </ul>

            {/* pseudo 3D model card */}
            <div className="relative h-40 md:h-44 max-w-md">
              <div className="absolute -inset-1 bg-gradient-to-tr from-teal-500/40 via-sky-500/30 to-violet-500/40 rounded-3xl blur-xl opacity-70" />
              <div className="relative h-full rounded-3xl border border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-[0_22px_70px_rgba(15,23,42,0.9)] transform-gpu rotate-[-4deg] md:rotate-[-6deg] hover:rotate-[-2deg] hover:-translate-y-1 transition-all duration-500 ease-out overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(45,212,191,0.22),transparent_55%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),transparent_60%)]" />
                <div className="relative h-full flex flex-col justify-between p-4">
                  <div className="flex items-center justify-between text-[11px] text-slate-300/90">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-2 py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live clicks
                    </span>
                    <span className="text-slate-400">smurl.to/campaign</span>
                  </div>
                  <div className="flex items-end justify-between gap-4">
                    <div className="space-y-1">
                      <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em]">
                        Today
                      </p>
                      <p className="text-2xl font-semibold text-slate-50">1,248</p>
                      <p className="text-[11px] text-emerald-300 flex items-center gap-1">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        +32% vs yesterday
                      </p>
                    </div>
                    <div className="flex gap-1.5 items-end">
                      <span className="h-6 w-2 rounded-full bg-gradient-to-t from-slate-700 to-teal-400" />
                      <span className="h-9 w-2 rounded-full bg-gradient-to-t from-slate-700 to-sky-400" />
                      <span className="h-4 w-2 rounded-full bg-gradient-to-t from-slate-700 to-emerald-400" />
                      <span className="h-8 w-2 rounded-full bg-gradient-to-t from-slate-700 to-cyan-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl shadow-teal-500/10">
            <h2 className="text-sm font-semibold mb-3 text-slate-100">
              Try it now — no account needed
            </h2>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Paste a long URL
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/your/campaign/link"
                  className="w-full rounded-lg bg-slate-950 border border-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium bg-teal-500 text-slate-950 hover:bg-teal-400 disabled:opacity-60"
              >
                {loading ? 'Shortening...' : 'Shorten URL'}
              </button>
            </form>

            {shortUrl && (
              <div className="mt-5 space-y-3">
                <div className="flex items-center justify-between gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3 py-2">
                  <span className="text-xs md:text-sm truncate">{shortUrl}</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-[11px] px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700"
                  >
                    Copy
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <QRCodeCanvas id="smurl-qr" value={shortUrl} size={96} bgColor="#020617" fgColor="#e5e7eb" />
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <p className="font-medium text-slate-200">QR code ready to share</p>
                    <p>Scan on mobile or drop it into your designs.</p>
                    <button
                      onClick={downloadQR}
                      className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px]"
                    >
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            )}

            {!shortUrl && (
              <p className="mt-4 text-[11px] text-slate-500">
                Want full analytics, custom domains, and history?{' '}
                <Link to="/register" className="text-teal-400 hover:underline">
                  Create a free account
                </Link>
                .
              </p>
            )}
          </div>
        </section>

        {/* brands & extra info */}
        <section className="border-t border-slate-800 pt-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Trusted on campaigns at
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
              <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">
                Flowline Studio
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">
                Northwind Labs
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">
                Pixelwave Media
              </span>
              <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">
                Aurora Collective
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-400">
            <ScrollReveal>
              <div className="space-y-1.5">
                <h3 className="text-slate-100 text-sm font-semibold">Link intelligence</h3>
                <p>
                  Every click records geo, browser, and referrer so you can understand where your
                  traffic really comes from.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="space-y-1.5">
                <h3 className="text-slate-100 text-sm font-semibold">Built for teams</h3>
                <p>
                  Share short links with your team, keep a searchable history, and standardize how
                  your brand shows up everywhere.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={220}>
              <div className="space-y-1.5">
                <h3 className="text-slate-100 text-sm font-semibold">Fast & privacy‑aware</h3>
                <p>
                  Lightweight redirects, secure storage, and analytics that focus on performance,
                  not invasive profiling.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* scrolling asset-style previews */}
          <ScrollReveal delay={180}>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-[11px] text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Email campaign
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 space-y-2">
                  <div className="h-1.5 w-16 rounded-full bg-slate-600" />
                  <div className="h-1.5 w-28 rounded-full bg-slate-700" />
                  <div className="mt-1 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-teal-400" />
                    <span className="h-1.5 w-20 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Social post
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 space-y-2">
                  <div className="h-16 rounded-lg bg-slate-700/80" />
                  <div className="flex items-center justify-between mt-1">
                    <span className="h-1.5 w-16 rounded-full bg-slate-600" />
                    <span className="h-1.5 w-6 rounded-full bg-teal-400" />
                  </div>
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  QR in print
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center gap-3">
                  <div className="h-12 w-12 rounded-md border border-slate-600 bg-slate-900" />
                  <div className="space-y-1">
                    <div className="h-1.5 w-20 rounded-full bg-slate-600" />
                    <div className="h-1.5 w-12 rounded-full bg-slate-700" />
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={260}>
            <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500">
              <p>Sign up to unlock full analytics, history, and team‑ready features.</p>
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg border border-slate-700 hover:border-teal-400"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-teal-500/60 hover:bg-slate-800"
                >
                  Create account
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* how it works & details */}
        <section className="mt-16 space-y-10 text-xs md:text-sm text-slate-300">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              <div className="md:col-span-1 space-y-2">
                <h2 className="text-base md:text-lg font-semibold text-slate-50">
                  How Smurl fits into your stack
                </h2>
                <p className="text-slate-400">
                  From a single landing page to multi‑channel campaigns, Smurl stays in the middle
                  of every click.
                </p>
              </div>
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">1. Shorten</p>
                  <p className="text-slate-400">
                    Drop any URL into Smurl — UTMs, redirects, or long product URLs — and get a
                    clean link or QR in seconds.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">2. Share anywhere</p>
                  <p className="text-slate-400">
                    Use your short link across email, socials, ads, or print without changing your
                    original destination.
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-1">
                  <p className="text-[11px] font-semibold text-slate-200">3. Read the story</p>
                  <p className="text-slate-400">
                    Once you&apos;re signed in, Smurl turns every hit into analytics you can filter
                    by time, country, and browser.
                  </p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ScrollReveal>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Typical use cases</h3>
                <ul className="list-disc list-inside space-y-1 text-slate-400">
                  <li>Newsletter & lifecycle emails</li>
                  <li>Paid ad tracking (social & search)</li>
                  <li>Influencer & partnership links</li>
                  <li>Event tickets & venue signage via QR</li>
                </ul>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={140}>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-semibold text-slate-100">What we store</h3>
                <p className="text-slate-400">
                  For each click we record timestamp, country (via IP), browser, and referrer. We do
                  not store page content or personal profile data.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={260}>
              <div className="space-y-2 rounded-2xl border border-slate-800 bg-slate-950/80 p-4">
                <h3 className="text-sm font-semibold text-slate-100">Performance at scale</h3>
                <p className="text-slate-400">
                  The backend is built on Fastify and PostgreSQL so your redirects stay fast, even
                  when a launch drives sudden spikes in traffic.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>
    </div>
  );
};

