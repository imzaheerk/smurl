import { Link } from 'react-router-dom';
import { BarChart3, MapPin, Monitor, TrendingUp } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { LANDING_CARD, LANDING_FOCUS, LANDING_SCENE_PANEL, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const CLICK_DATA = [
  { day: 'Mon', value: 42 },
  { day: 'Tue', value: 68 },
  { day: 'Wed', value: 55 },
  { day: 'Thu', value: 91 },
  { day: 'Fri', value: 74 },
  { day: 'Sat', value: 38 },
  { day: 'Sun', value: 29 }
] as const;

const COUNTRIES = [
  { name: 'United States', pct: 38 },
  { name: 'United Kingdom', pct: 22 },
  { name: 'Germany', pct: 14 },
  { name: 'Other', pct: 26 }
] as const;

const BROWSERS = [
  { name: 'Chrome', pct: 61 },
  { name: 'Safari', pct: 24 },
  { name: 'Firefox', pct: 9 },
  { name: 'Other', pct: 6 }
] as const;

const maxClicks = Math.max(...CLICK_DATA.map((d) => d.value));

export function AnalyticsPreviewSection() {
  return (
    <section id="analytics" className="mt-20 scroll-mt-24 md:mt-28" aria-label="Analytics preview">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className={LANDING_SECTION_LABEL}>Analytics</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            See every click, not just the count
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-violet-200/50">
            Sign in to unlock a full dashboard — filter by date, drill into referrers, and export
            data when campaigns wrap.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className={LANDING_SCENE_PANEL + ' p-5 md:p-8'}>
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_30%_0%,rgba(232,121,249,0.1),transparent)]"
            aria-hidden
          />

          <div className="relative grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
            <div className={'lg:col-span-8 ' + LANDING_CARD + ' p-5'}>
              <div className="mb-5 flex max-sm:flex-col max-sm:items-start max-sm:gap-2 items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-fuchsia-400" aria-hidden />
                  <span className="text-sm font-semibold text-white">Clicks this week</span>
                </div>
                <span className="flex items-center gap-1 text-xs text-emerald-400 max-sm:mt-0">
                  <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                  +24% vs last week
                </span>
              </div>
              <div className="flex h-36 items-end justify-between gap-2">
                {CLICK_DATA.map((d) => (
                  <div key={d.day} className="flex flex-1 flex-col items-center gap-2">
                    <div
                      className="w-full rounded-t-md bg-gradient-to-t from-fuchsia-600/80 to-fuchsia-400/90 transition-all"
                      style={{ height: `${(d.value / maxClicks) * 100}%`, minHeight: '8px' }}
                      title={`${d.value} clicks`}
                    />
                    <span className="text-[10px] text-violet-400/50">{d.day}</span>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-violet-300/45">
                Sample data from a campaign short link · smurl.to/demo24
              </p>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-4">
              <div className={LANDING_CARD + ' p-4'}>
                <div className="mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-amber-400" aria-hidden />
                  <span className="text-xs font-semibold text-white">Top countries</span>
                </div>
                <ul className="space-y-2.5">
                  {COUNTRIES.map((c) => (
                    <li key={c.name}>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-violet-200/60">{c.name}</span>
                        <span className="text-violet-300/70">{c.pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-400"
                          style={{ width: `${c.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={LANDING_CARD + ' p-4'}>
                <div className="mb-3 flex items-center gap-2">
                  <Monitor className="h-4 w-4 text-violet-400" aria-hidden />
                  <span className="text-xs font-semibold text-white">Browsers</span>
                </div>
                <ul className="space-y-2.5">
                  {BROWSERS.map((b) => (
                    <li key={b.name}>
                      <div className="mb-1 flex justify-between text-[11px]">
                        <span className="text-violet-200/60">{b.name}</span>
                        <span className="text-violet-300/70">{b.pct}%</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-400"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="relative mt-5 flex flex-col items-center justify-between gap-3 border-t border-white/[0.06] pt-5 sm:flex-row">
            <p className="text-xs text-violet-200/50">
              Referrer, device, and time-range filters available in your dashboard.
            </p>
            <Link
              to={ROUTES.REGISTER}
              className={
                'inline-flex shrink-0 rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/15 px-4 py-2 text-xs font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/25 max-sm:min-h-[44px] max-sm:w-full max-sm:items-center max-sm:justify-center max-sm:py-2.5 ' +
                LANDING_FOCUS
              }
            >
              Unlock full analytics →
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
