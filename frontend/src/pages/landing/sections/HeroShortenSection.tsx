import { Link } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { ROUTES } from '../../../constants/routes';
import { Button } from '../../../components/ui';

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
  return (
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
                  <p className="text-[11px] text-slate-400 uppercase tracking-[0.18em]">Today</p>
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
            <Button
              type="submit"
              variant="primaryViolet"
              fullWidth
              disabled={loading}
            >
              {loading ? 'Shortening…' : 'Shorten URL'}
            </Button>
          </form>

          {shortUrl && (
            <div className="mt-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-3">
                <span className="text-xs md:text-sm break-all select-text text-slate-200 min-w-0" title={shortUrl}>{shortUrl}</span>
                <Button
                  type="button"
                  variant="secondaryCyan"
                  onClick={copyToClipboard}
                  className="shrink-0 min-h-[44px] px-4 py-2.5 sm:py-1.5 text-xs"
                  aria-label={copied ? 'Copied' : 'Copy link'}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <QRCodeCanvas id="smurl-qr" value={shortUrl} size={96} bgColor="#020617" fgColor="#e5e7eb" />
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <p className="font-medium text-slate-200">QR code ready to share</p>
                  <p>Scan on mobile or drop it into your designs.</p>
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
              Want full analytics, custom domains, and history?{' '}
              <Link to={ROUTES.REGISTER} className="text-teal-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 rounded">
                Create a free account
              </Link>
              .
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
