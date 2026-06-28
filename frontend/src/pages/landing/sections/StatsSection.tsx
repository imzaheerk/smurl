import { BarChart3, FolderOpen, Link2, QrCode } from 'lucide-react';
import { LANDING_CARD, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const HIGHLIGHTS = [
  {
    icon: Link2,
    title: 'Custom short codes',
    detail: 'Memorable aliases for campaigns, email, and social posts',
    accent: 'text-fuchsia-400',
    glow: 'from-fuchsia-500/20'
  },
  {
    icon: BarChart3,
    title: 'Click analytics',
    detail: 'Geo, device, and referrer breakdowns in your dashboard',
    accent: 'text-amber-400',
    glow: 'from-amber-500/20'
  },
  {
    icon: FolderOpen,
    title: 'Folders & search',
    detail: 'Organize links, filter by status, and import via CSV',
    accent: 'text-violet-400',
    glow: 'from-violet-500/20'
  },
  {
    icon: QrCode,
    title: 'QR & API',
    detail: 'Generate QR codes instantly or automate with REST endpoints',
    accent: 'text-pink-400',
    glow: 'from-pink-500/20'
  }
] as const;

export function StatsSection() {
  return (
    <section className="mb-20 md:mb-28" aria-label="Platform highlights">
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
        {HIGHLIGHTS.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 80} className="h-full">
            <div
              className={
                LANDING_CARD +
                ' group relative h-full overflow-hidden p-6 transition-colors hover:border-fuchsia-500/20 hover:bg-white/[0.04]'
              }
            >
              <div
                className={
                  'pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br to-transparent opacity-60 blur-2xl ' +
                  item.glow
                }
                aria-hidden
              />
              <item.icon className={'h-5 w-5 ' + item.accent} aria-hidden />
              <p className="mt-4 text-base font-bold text-white">{item.title}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-violet-200/45">{item.detail}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
