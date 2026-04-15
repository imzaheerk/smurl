import { lazy, Suspense } from 'react';
import { KeyRound, Megaphone, Users } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
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
  },
  {
    to: ROUTES.LOGIN,
    icon: <KeyRound className="h-5 w-5" aria-hidden />,
    title: 'Developers',
    description: 'API keys in Settings. Shorten URLs from scripts and servers with Bearer auth.',
    ctaText: 'Log in to Settings →',
  },
  {
    to: ROUTES.REGISTER,
    icon: <Users className="h-5 w-5" aria-hidden />,
    title: 'Teams',
    description: 'Shared link history, folders, and custom domains so your brand stays consistent.',
    ctaText: 'Create account →',
  },
] as const;

export function BuiltForSection() {
  return (
    <section className="mt-16 md:mt-20">
      <ScrollReveal>
        <div className="space-y-6">
          <h2 className="text-center text-base font-semibold text-slate-50 md:text-lg">
            Built for how you work
          </h2>

          <div className="relative min-h-[200px] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/55 shadow-[0_22px_75px_rgba(2,6,23,0.5)] md:min-h-[240px]">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(167,139,250,0.1),transparent)]"
              aria-hidden
            />
            <Suspense
              fallback={
                <div className="min-h-[200px] w-full animate-pulse bg-slate-900/40 md:min-h-[240px]" />
              }
            >
              <LandingBuiltForScene />
            </Suspense>
            <div
              className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-10 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-600 md:gap-16"
              aria-hidden
            >
              <span>Marketers</span>
              <span>Developers</span>
              <span>Teams</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {CARDS.map((card) => (
              <BuiltForCard key={card.title} {...card} />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
