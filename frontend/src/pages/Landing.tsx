import { ReactNode, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { QRCodeCanvas } from 'qrcode.react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { KeyRound, Megaphone, Users, Sparkles } from 'lucide-react';
import iconLinkIntelligence from '../assets/icon-link-intelligence.svg';
import iconBuiltForTeams from '../assets/icon-built-for-teams.svg';
import iconFastPrivacy from '../assets/icon-fast-privacy.svg';
import iconEmailCampaign from '../assets/icon-email-campaign.svg';
import iconSocialPost from '../assets/icon-social-post.svg';
import iconQrPrint from '../assets/icon-qr-print.svg';

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
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post<ShortenResponse>('/public/shorten', { url });
      setShortUrl(res.data.shortUrl);
      toast.success('Link shortened!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    const text = shortUrl;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
        return;
      }
    } catch {
      /* clipboard API failed, use fallback */
    }
    // Fallback for mobile / insecure context
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.setSelectionRange(0, text.length);
    try {
      const ok = document.execCommand('copy');
      if (ok) {
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } else {
        toast.error('Copy failed. Tap and hold the link to copy.');
      }
    } catch {
      toast.error('Copy failed. Tap and hold the link to copy.');
    }
    document.body.removeChild(textarea);
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
    <div className="min-h-screen bg-slate-950 text-slate-50 bg-grid bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-900/95">
      {/* Ambient orbs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-500/15 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-sky-500/12 blur-[90px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-violet-500/10 blur-[80px] animate-[pulse_9s_ease-in-out_infinite]" />
      </div>

      <header className="relative sticky top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 md:py-5">
          <Link to="/" className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg relative">
            {/* Red fade glow behind logo */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-11 h-11 rounded-xl bg-red-500/40 blur-lg pointer-events-none" style={{ animation: 'red-fade-glow 4s ease-in-out infinite' }} aria-hidden />
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-14 h-14 rounded-xl pointer-events-none" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(239, 68, 68, 0.35), transparent 70%)', filter: 'blur(12px)', animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
            <div
              className="relative w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-teal-400/80 group-hover:bg-teal-500/20 shrink-0 shadow-lg shadow-red-500/20"
              style={{ animation: 'float 3s ease-in-out infinite' }}
            >
              <span className="text-sm font-bold text-teal-400">S</span>
            </div>
            {/* Red fade around signature */}
            <span className="relative inline-block">
              <span className="absolute -inset-1 rounded-md bg-gradient-to-r from-red-500/25 via-red-400/15 to-red-500/25 blur-sm opacity-80 group-hover:opacity-100 transition-opacity" style={{ animation: 'red-fade-drift 5s ease-in-out infinite' }} aria-hidden />
              <span className="relative text-xl font-semibold text-teal-300/90 group-hover:text-teal-200 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>Smurl</span>
            </span>
          </Link>
          <nav className="flex items-center gap-2 text-sm" aria-label="Account">
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Log in
            </Link>
            <Link
              to="/login"
              className="hidden sm:flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold text-cyan-300 bg-gradient-to-r from-cyan-500/20 to-red-500/20 border border-cyan-500/30 hover:border-cyan-400/50 hover:from-cyan-500/25 hover:to-red-500/25 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Demo login
            </Link>
            <Link
              to="/register"
              className="flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-teal-500 to-emerald-500 text-slate-950 border border-teal-400/50 hover:from-teal-400 hover:to-emerald-400 hover:border-teal-300/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Get started
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
        <section id="shorten" className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-20 scroll-mt-24">
          <div className="space-y-6">
            <div className="relative pl-5 md:pl-6 border-l-4 border-teal-500/70">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-teal-400/90 mb-3">
                The smart way to share
              </p>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight leading-[1.12] space-y-2">
                <span className="block bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(45,212,191,0.25)]">
                  Shorten links.
                </span>
                <span className="block text-slate-100 tracking-wide font-medium">
                  Share anywhere.
                </span>
                <span className="block bg-gradient-to-r from-sky-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(52,211,153,0.2)]">
                  Track everything.
                </span>
              </h1>
            </div>
            <p className="text-base md:text-lg text-slate-400 max-w-xl leading-relaxed">
              Smurl turns long, messy URLs into clean short links with built‑in analytics and QR
              codes. Perfect for campaigns, social, and print.
            </p>
            <ul className="text-sm text-slate-300 space-y-2 mb-6" role="list">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden />
                One‑click URL shortening
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden />
                QR codes ready for print or sharing
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden />
                Detailed analytics once you create an account
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-teal-400 shrink-0" aria-hidden />
                API keys for scripts and servers — no UI login needed
              </li>
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

          <div className="relative">
            <div className="absolute -inset-px bg-gradient-to-br from-teal-500/30 via-transparent to-sky-500/20 rounded-2xl blur-sm opacity-80" aria-hidden />
            <div className="relative bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl shadow-teal-500/10 backdrop-blur-sm">
              <h2 className="text-base font-semibold mb-4 text-slate-100">
                Try it now — no account needed
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="landing-url" className="block text-xs font-medium text-slate-300 mb-1.5">
                    Paste a long URL
                  </label>
                  <input
                    id="landing-url"
                    type="url"
                    required
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/your/campaign/link"
                    className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-teal-500/70 focus:border-teal-400/50 transition"
                    autoComplete="url"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Shortening…' : 'Shorten URL'}
                </button>
              </form>

              {shortUrl && (
                <div className="mt-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3">
                    <span className="text-xs md:text-sm break-all select-text text-slate-200 min-w-0" title={shortUrl}>{shortUrl}</span>
                    <button
                      type="button"
                      onClick={copyToClipboard}
                      className="shrink-0 text-xs font-medium min-h-[44px] px-4 py-2.5 sm:py-1.5 rounded-lg bg-teal-500/20 text-teal-300 border border-teal-400/40 hover:bg-teal-500/30 active:bg-teal-500/30 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors touch-manipulation"
                      aria-label={copied ? 'Copied' : 'Copy link'}
                    >
                      {copied ? 'Copied!' : 'Copy'}
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
                      type="button"
                      onClick={downloadQR}
                      className="mt-1 inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors"
                    >
                      Download PNG
                    </button>
                  </div>
                </div>
              </div>
            )}

              {!shortUrl && (
                <p className="mt-5 text-xs text-slate-500">
                  Want full analytics, custom domains, and history?{' '}
                  <Link to="/register" className="text-teal-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded">
                    Create a free account
                  </Link>
                  .
                </p>
              )}
            </div>
          </div>
        </section>

        {/* trust strip */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 text-xs text-slate-500 border-y border-slate-800/80">
            <span className="flex items-center gap-2">
              <Sparkles className="h-3.5 w-3.5 text-teal-400/80" aria-hidden />
              No credit card required
            </span>
            <span className="hidden sm:inline text-slate-600" aria-hidden>·</span>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-teal-400/80" aria-hidden />
              Free to start
            </span>
            <span className="hidden sm:inline text-slate-600" aria-hidden>·</span>
            <span>Analytics & QR included</span>
          </div>
        </ScrollReveal>

        {/* brands & extra info / features */}
        <section id="features" className="pt-8 space-y-6 scroll-mt-24">
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs text-slate-400">
            <ScrollReveal>
              <div className="space-y-1.5">
                <img src={iconLinkIntelligence} alt="" className="h-10 w-10 text-teal-400" />
                <h3 className="text-slate-100 text-sm font-semibold">Link intelligence</h3>
                <p>
                  Every click records geo, browser, and referrer so you can understand where your
                  traffic really comes from.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={120}>
              <div className="space-y-1.5">
                <img src={iconBuiltForTeams} alt="" className="h-10 w-10 text-teal-400" />
                <h3 className="text-slate-100 text-sm font-semibold">Built for teams</h3>
                <p>
                  Share short links with your team, keep a searchable history, and standardize how
                  your brand shows up everywhere.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={220}>
              <div className="space-y-1.5">
                <img src={iconFastPrivacy} alt="" className="h-10 w-10 text-teal-400" />
                <h3 className="text-slate-100 text-sm font-semibold">Fast & privacy‑aware</h3>
                <p>
                  Lightweight redirects, secure storage, and analytics that focus on performance,
                  not invasive profiling.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={320}>
              <div className="space-y-1.5">
                <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-400">
                  <KeyRound className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-slate-100 text-sm font-semibold">API keys for developers</h3>
                <p>
                  Create API keys in Settings and shorten URLs from scripts or servers with{' '}
                  <code className="text-teal-300/90">Authorization: Bearer &lt;key&gt;</code>. No browser login required.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* scrolling asset-style previews */}
          <ScrollReveal delay={180}>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px] text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Email campaign
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconEmailCampaign} alt="" className="h-12 w-12" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Social post
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconSocialPost} alt="" className="h-12 w-12" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  QR in print
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconQrPrint} alt="" className="h-12 w-12" />
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-3 shadow-lg shadow-slate-950/70">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">
                  Developer API
                </p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <div className="rounded-xl bg-teal-500/10 border border-teal-400/30 p-3 flex items-center justify-center">
                    <KeyRound className="h-12 w-12 text-teal-400" aria-hidden />
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

        {/* who it's for */}
        <section className="mt-16 md:mt-20">
          <ScrollReveal>
            <h2 className="text-center text-base md:text-lg font-semibold text-slate-50 mb-6">
              Built for how you work
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                to="/register"
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 hover:border-teal-500/40 hover:bg-slate-900/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                  <Megaphone className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Marketers & campaigns</h3>
                <p className="text-xs text-slate-400">
                  Short links for email, social, and ads. Track clicks by country, referrer, and device.
                </p>
                <span className="text-xs font-medium text-teal-400 group-hover:text-teal-300 mt-auto">
                  Get started →
                </span>
              </Link>
              <Link
                to="/login"
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 hover:border-teal-500/40 hover:bg-slate-900/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                  <KeyRound className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Developers</h3>
                <p className="text-xs text-slate-400">
                  API keys in Settings. Shorten URLs from scripts and servers with Bearer auth.
                </p>
                <span className="text-xs font-medium text-teal-400 group-hover:text-teal-300 mt-auto">
                  Log in to Settings →
                </span>
              </Link>
              <Link
                to="/register"
                className="group flex flex-col gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 hover:border-teal-500/40 hover:bg-slate-900/60 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10 border border-teal-500/30 text-teal-400 group-hover:bg-teal-500/20 transition-colors">
                  <Users className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="text-sm font-semibold text-slate-100">Teams</h3>
                <p className="text-xs text-slate-400">
                  Shared link history, folders, and custom domains so your brand stays consistent.
                </p>
                <span className="text-xs font-medium text-teal-400 group-hover:text-teal-300 mt-auto">
                  Create account →
                </span>
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* how it works & details */}
        <section id="how-it-works" className="mt-16 space-y-10 text-xs md:text-sm text-slate-300 scroll-mt-24">
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

        {/* FAQs */}
        <section id="faq" className="mt-20 border-t border-slate-800 pt-12 scroll-mt-24">
          <ScrollReveal>
            <h2 className="text-base md:text-lg font-semibold text-slate-50 mb-6">
              Frequently asked questions
            </h2>
            <ul className="space-y-2 text-sm">
              {[
                {
                  q: 'What is Smurl?',
                  a: 'Smurl is a URL shortener that turns long links into short, shareable URLs. You can use it for campaigns, social posts, and print (via QR codes), with optional analytics when you create a free account.'
                },
                {
                  q: 'How does Smurl work?',
                  a: 'Paste any long URL on the landing page or in your dashboard. Smurl generates a short link (e.g. smurl.to/abc12) that redirects to your original URL. You can share the short link or its QR code anywhere. If you\'re logged in, every click is recorded for analytics.'
                },
                {
                  q: 'What are the benefits of using Smurl?',
                  a: 'Short links look cleaner in emails and social posts, are easier to type for print or verbal sharing, and can be tracked. With an account you get click analytics (country, browser, referrer), QR codes, a searchable link history, and the option to use custom domains.'
                },
                {
                  q: 'Is Smurl free?',
                  a: 'Yes. You can shorten links without an account. Creating a free account unlocks analytics, link history, QR codes, and more. We may offer premium plans later for higher limits or team features.'
                },
                {
                  q: 'Do I need an account to shorten links?',
                  a: 'No. You can shorten a URL once from the landing page without signing up. To save links, view analytics, and manage QR codes or custom domains, create a free account.'
                },
                {
                  q: 'Can I use my own domain?',
                  a: 'Yes. With a Smurl account you can add and verify custom domains so your short links use your brand (e.g. links.yourbrand.com/xyz) instead of smurl.to.'
                },
                {
                  q: 'Is my data secure?',
                  a: 'We store only what\'s needed for redirects and analytics: the destination URL, click timestamps, and anonymized metadata (country, browser, referrer). Passwords are hashed; we don\'t store or inspect the content of the pages you link to.'
                }
              ].map((faq, i) => (
                <li key={i}>
                  <Disclosure as="div" className="rounded-xl border border-slate-800 bg-slate-950/80 overflow-hidden">
                    {({ open }) => (
                      <>
                        <DisclosureButton className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-slate-200 hover:bg-slate-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset transition-colors">
                          <span className="font-medium pr-2">{faq.q}</span>
                          <ChevronDownIcon className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
                        </DisclosureButton>
                        <DisclosurePanel className="px-4 pb-3.5 pt-0 text-slate-400 border-t border-slate-800/80">
                          {faq.a}
                        </DisclosurePanel>
                      </>
                    )}
                  </Disclosure>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </section>

        {/* Links & social */}
        <section className="mt-20 border-t border-slate-800 pt-12">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-12">
              {/* Left: social icons */}
              <div className="shrink-0">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">
                  Follow us
                </p>
                <div className="flex items-center gap-3">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-slate-700/80 text-slate-400 hover:border-teal-400/60 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors" aria-label="Instagram">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-slate-700/80 text-slate-400 hover:border-teal-400/60 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors" aria-label="Facebook">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                  <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-slate-700/80 text-slate-400 hover:border-teal-400/60 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors" aria-label="X">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-slate-700/80 text-slate-400 hover:border-teal-400/60 hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 transition-colors" aria-label="LinkedIn">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
                </div>
                <Link to="/" className="mt-6 flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg w-fit">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/10 border border-teal-400/50 flex items-center justify-center transition-all duration-300 group-hover:border-teal-400/80 group-hover:bg-teal-500/20 shrink-0">
                    <span className="text-sm font-bold text-teal-400">S</span>
                  </div>
                  <span className="text-2xl font-semibold text-teal-300/90 group-hover:text-teal-200 transition-colors" style={{ fontFamily: "'Dancing Script', cursive" }}>
                    Smurl
                  </span>
                </Link>
                <p className="mt-4 text-sx text-slate-400">
                  © 2026 smurl<br />
                  All Rights Reserved
                </p>
              </div>

              {/* Right: link columns - all links go somewhere useful */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 min-w-0">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Features</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#shorten" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Link shortening & QR</a></li>
                    <li><Link to="/login" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Analytics & tracking</Link></li>
                    <li><Link to="/register" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Custom domains</Link></li>
                    <li><Link to="/login" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">API for developers</Link></li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Resources</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="#faq" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">FAQ</a></li>
                    <li><Link to="/login" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">For developers</Link></li>
                    <li><a href="#faq" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">How it works</a></li>
                    <li><a href="#features" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">About Smurl</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Contact us</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><a href="mailto:support@smurl.app" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Support</a></li>
                    <li><a href="mailto:hello@smurl.app" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">General inquiry</a></li>
                    <li><a href="mailto:abuse@smurl.app" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Report abuse</a></li>
                  </ul>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500 mb-3">Legal</p>
                  <ul className="space-y-2 text-sm text-slate-400">
                    <li><Link to="/terms" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Terms of Service</Link></li>
                    <li><Link to="/privacy" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Privacy Policy</Link></li>
                    <li><Link to="/privacy" className="hover:text-teal-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded">Accessibility</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>
    </div>
  );
};
