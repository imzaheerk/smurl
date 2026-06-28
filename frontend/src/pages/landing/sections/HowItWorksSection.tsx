import { lazy, Suspense } from 'react';
import { LANDING_CARD, LANDING_SCENE_PANEL, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const LandingHowItWorksScene = lazy(() =>
  import('../components/LandingHowItWorksScene').then((m) => ({ default: m.LandingHowItWorksScene }))
);

const STEPS = [
  {
    num: '01',
    title: 'Shorten',
    description:
      'Drop any URL into Smurl — UTMs, redirects, or long product URLs — and get a clean link or QR in seconds.'
  },
  {
    num: '02',
    title: 'Share anywhere',
    description:
      'Use your short link across email, socials, ads, or print without changing your original destination.'
  },
  {
    num: '03',
    title: 'Read the story',
    description:
      "Once you're signed in, Smurl turns every hit into analytics you can filter by time, country, and browser."
  }
] as const;

const INFO_CARDS = [
  {
    title: 'Typical use cases',
    items: [
      'Newsletter & lifecycle emails',
      'Paid ad tracking (social & search)',
      'Influencer & partnership links',
      'Event tickets & venue signage via QR'
    ]
  },
  {
    title: 'What we store',
    description:
      'For each click we record timestamp, country (via IP), browser, and referrer. We do not store page content or personal profile data.'
  },
  {
    title: 'Performance at scale',
    description:
      'The backend is built on Fastify and PostgreSQL so your redirects stay fast, even when a launch drives sudden spikes in traffic.'
  }
] as const;

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="mt-20 scroll-mt-24 space-y-12 md:mt-28">
      <ScrollReveal>
        <div className="text-center">
          <p className={LANDING_SECTION_LABEL}>How it works</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Three steps to smarter links
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div className="space-y-0">
          {STEPS.map((step, i) => (
            <ScrollReveal key={step.num} delay={i * 100}>
              <div className="relative flex gap-5 pb-10 last:pb-0">
                {i < STEPS.length - 1 && (
                  <div
                    className="absolute left-[1.65rem] top-12 h-[calc(100%-2rem)] w-px bg-gradient-to-b from-fuchsia-500/40 to-transparent"
                    aria-hidden
                  />
                )}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/10 text-sm font-bold text-fuchsia-300">
                  {step.num}
                </div>
                <div className="pt-2">
                  <h3 className="text-base font-semibold text-white">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-violet-200/50">{step.description}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={150} className="h-full">
          <div className={'min-h-[280px] ' + LANDING_SCENE_PANEL}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(139,92,246,0.12),transparent)]"
              aria-hidden
            />
            <Suspense
              fallback={<div className="min-h-[280px] w-full animate-pulse bg-violet-950/30" />}
            >
              <LandingHowItWorksScene />
            </Suspense>
            <div
              className="pointer-events-none absolute bottom-3 left-4 right-4 flex justify-between text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-500/60"
              aria-hidden
            >
              <span>Shorten</span>
              <span>Share</span>
              <span>Measure</span>
            </div>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {INFO_CARDS.map((card, i) => (
          <ScrollReveal key={card.title} delay={i * 120} className="h-full">
            <div className={LANDING_CARD + ' h-full p-5'}>
              <h3 className="text-sm font-semibold text-white">{card.title}</h3>
              {'items' in card ? (
                <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-violet-200/50">
                  {card.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm leading-relaxed text-violet-200/50">{card.description}</p>
              )}
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
