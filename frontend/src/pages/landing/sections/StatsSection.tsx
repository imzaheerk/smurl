import { Globe, Link2, MousePointerClick, Zap } from 'lucide-react';
import { LANDING_CARD, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const STATS = [
  {
    icon: Link2,
    value: '2.4M+',
    label: 'Links shortened',
    detail: 'Across campaigns, email, and social',
    accent: 'text-fuchsia-400',
    glow: 'from-fuchsia-500/20'
  },
  {
    icon: MousePointerClick,
    value: '18M+',
    label: 'Clicks tracked',
    detail: 'Geo, device, and referrer data',
    accent: 'text-amber-400',
    glow: 'from-amber-500/20'
  },
  {
    icon: Globe,
    value: '40+',
    label: 'Countries reached',
    detail: 'Audience insights worldwide',
    accent: 'text-violet-400',
    glow: 'from-violet-500/20'
  },
  {
    icon: Zap,
    value: '99.9%',
    label: 'Uptime',
    detail: 'Redirects that never sleep',
    accent: 'text-pink-400',
    glow: 'from-pink-500/20'
  }
] as const;

export function StatsSection() {
  return (
    <section className="mb-20 md:mb-28" aria-label="Platform statistics">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className={LANDING_SECTION_LABEL}>By the numbers</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Built for scale, trusted daily
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-violet-200/50">
            From one-off shares to full-funnel campaigns — Smurl handles the redirects while you
            focus on the message.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 80} className="h-full">
            <div
              className={
                LANDING_CARD +
                ' group relative h-full overflow-hidden p-6 transition-colors hover:border-fuchsia-500/20 hover:bg-white/[0.04]'
              }
            >
              <div
                className={
                  'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl ' +
                  stat.glow
                }
                aria-hidden
              />
              <stat.icon className={'h-5 w-5 ' + stat.accent} aria-hidden />
              <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-violet-100">{stat.label}</p>
              <p className="mt-1.5 text-xs text-violet-200/45">{stat.detail}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
