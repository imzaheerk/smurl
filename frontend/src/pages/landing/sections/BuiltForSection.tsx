import { lazy, Suspense } from 'react';
import { KeyRound, Megaphone, Users } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { LANDING_SCENE_PANEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';
import { BuiltForCard } from './BuiltForCard';

const LandingBuiltForScene = lazy(() =>
  import('../components/LandingBuiltForScene').then((m) => ({ default: m.LandingBuiltForScene }))
);

const CARDS = [
  {
    to: ROUTES.REGISTER,
    icon: <Megaphone className="h-5 w-5" aria-hidden />,
    title: 'Marketers & campaigns',
    description: 'Short links for email, social, and ads. Track clicks by country, referrer, and device.',
    ctaText: 'Get started →',
    accent: 'from-fuchsia-500/20 to-pink-500/10'
  },
  {
    to: ROUTES.LOGIN,
    icon: <KeyRound className="h-5 w-5" aria-hidden />,
    title: 'Developers',
    description: 'API keys in Settings. Shorten URLs from scripts and servers with Bearer auth.',
    ctaText: 'Log in to Settings →',
    accent: 'from-violet-500/20 to-indigo-500/10'
  },
  {
    to: ROUTES.REGISTER,
    icon: <Users className="h-5 w-5" aria-hidden />,
    title: 'Teams',
    description: 'Shared link history, folders, and custom domains so your brand stays consistent.',
    ctaText: 'Create account →',
    accent: 'from-amber-500/20 to-orange-500/10'
  }
] as const;

export function BuiltForSection() {
  return (
    <section className="mt-20 md:mt-28">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-400/70">
            Built for you
          </p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            One platform, every workflow
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
        <ScrollReveal className="h-full">
          <div className={'min-h-[300px] ' + LANDING_SCENE_PANEL + ' lg:min-h-[420px]'}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(251,191,36,0.1),transparent)]"
              aria-hidden
            />
            <Suspense fallback={<div className="min-h-[300px] w-full animate-pulse bg-violet-950/30 lg:min-h-[420px]" />}>
              <LandingBuiltForScene />
            </Suspense>
            <div
              className="pointer-events-none absolute bottom-3 left-0 right-0 flex justify-center gap-12 text-[9px] font-semibold uppercase tracking-[0.2em] text-violet-500/60 max-sm:gap-6 max-sm:text-[8px] max-sm:tracking-[0.15em] md:gap-20"
              aria-hidden
            >
              <span>Marketers</span>
              <span>Developers</span>
              <span>Teams</span>
            </div>
          </div>
        </ScrollReveal>

        <div className="flex flex-col gap-4">
          {CARDS.map((card, i) => (
            <ScrollReveal key={card.title} delay={i * 120} className="h-full">
              <BuiltForCard {...card} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
