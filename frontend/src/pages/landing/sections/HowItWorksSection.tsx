import { lazy, Suspense } from 'react';
import { Card } from '../../../components/ui';
import { ScrollReveal } from './ScrollReveal';

const LandingHowItWorksScene = lazy(() =>
  import('../components/LandingHowItWorksScene').then((m) => ({ default: m.LandingHowItWorksScene }))
);

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-16 space-y-10 text-xs md:text-sm text-slate-300 scroll-mt-24">
      <ScrollReveal>
        <div className="space-y-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="space-y-2 lg:col-span-5">
              <h2 className="text-base font-semibold text-slate-50 md:text-lg">
                How Smurl fits into your stack
              </h2>
              <p className="text-slate-400">
                From a single landing page to multi‑channel campaigns, Smurl stays in the middle
                of every click.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/60 shadow-[0_24px_80px_rgba(2,6,23,0.55)] lg:col-span-7">
              <div
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(45,212,191,0.12),transparent)]"
                aria-hidden
              />
              <Suspense
                fallback={<div className="min-h-[200px] w-full animate-pulse bg-slate-900/40 md:min-h-[240px]" />}
              >
                <LandingHowItWorksScene />
              </Suspense>
              <div
                className="pointer-events-none absolute bottom-3 left-4 right-4 flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500"
                aria-hidden
              >
                <span>Shorten</span>
                <span>Share</span>
                <span>Measure</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-200">1. Shorten</p>
              <p className="text-slate-400">
                Drop any URL into Smurl — UTMs, redirects, or long product URLs — and get a clean
                link or QR in seconds.
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-200">2. Share anywhere</p>
              <p className="text-slate-400">
                Use your short link across email, socials, ads, or print without changing your
                original destination.
              </p>
            </Card>
            <Card className="space-y-1">
              <p className="text-[11px] font-semibold text-slate-200">3. Read the story</p>
              <p className="text-slate-400">
                Once you&apos;re signed in, Smurl turns every hit into analytics you can filter by
                time, country, and browser.
              </p>
            </Card>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ScrollReveal>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100">Typical use cases</h3>
            <ul className="list-inside list-disc space-y-1 text-slate-400">
              <li>Newsletter & lifecycle emails</li>
              <li>Paid ad tracking (social & search)</li>
              <li>Influencer & partnership links</li>
              <li>Event tickets & venue signage via QR</li>
            </ul>
          </Card>
        </ScrollReveal>
        <ScrollReveal delay={140}>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100">What we store</h3>
            <p className="text-slate-400">
              For each click we record timestamp, country (via IP), browser, and referrer. We do not
              store page content or personal profile data.
            </p>
          </Card>
        </ScrollReveal>
        <ScrollReveal delay={260}>
          <Card className="space-y-2">
            <h3 className="text-sm font-semibold text-slate-100">Performance at scale</h3>
            <p className="text-slate-400">
              The backend is built on Fastify and PostgreSQL so your redirects stay fast, even when
              a launch drives sudden spikes in traffic.
            </p>
          </Card>
        </ScrollReveal>
      </div>
    </section>
  );
}
