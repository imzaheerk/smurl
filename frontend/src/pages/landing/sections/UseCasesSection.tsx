import { Mail, Megaphone, Newspaper, QrCode, Share2, Ticket } from 'lucide-react';
import { LANDING_CARD, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const USE_CASES = [
  {
    icon: Mail,
    title: 'Email newsletters',
    description:
      'Clean links in every CTA. Track which subject lines and buttons drive the most traffic.',
    tag: 'Lifecycle'
  },
  {
    icon: Share2,
    title: 'Social & influencer',
    description:
      'Short, memorable URLs for bios and posts. Swap destinations without changing the link.',
    tag: 'Social'
  },
  {
    icon: Megaphone,
    title: 'Paid ads',
    description:
      'UTM-heavy URLs hidden behind a single short link. Compare performance across channels.',
    tag: 'Ads'
  },
  {
    icon: QrCode,
    title: 'Print & packaging',
    description:
      'High-contrast QR codes for flyers, menus, and product labels. Download PNG in one click.',
    tag: 'QR'
  },
  {
    icon: Newspaper,
    title: 'Press & PR',
    description:
      'Shareable links for media kits and releases. See which outlets send the most readers.',
    tag: 'PR'
  },
  {
    icon: Ticket,
    title: 'Events & venues',
    description:
      'Ticket links and venue maps on signage. Real-time click data during and after the event.',
    tag: 'Events'
  }
] as const;

export function UseCasesSection() {
  return (
    <section className="mt-20 md:mt-28" aria-label="Use cases">
      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className={LANDING_SECTION_LABEL}>Use cases</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Wherever links go, Smurl fits
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-violet-200/50">
            One short link works across every channel — email, social, print, and beyond.
          </p>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {USE_CASES.map((item, i) => (
          <ScrollReveal key={item.title} delay={i * 70} className="h-full">
            <div
              className={
                LANDING_CARD +
                ' group h-full p-5 transition-colors hover:border-fuchsia-500/20 hover:bg-white/[0.04]'
              }
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/25 bg-fuchsia-500/10 text-fuchsia-400 transition-colors group-hover:bg-fuchsia-500/20">
                  <item.icon className="h-5 w-5" aria-hidden />
                </div>
                <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-400/60">
                  {item.tag}
                </span>
              </div>
              <h3 className="mt-4 text-sm font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-violet-200/50">{item.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
