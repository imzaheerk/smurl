import { Shield, Sparkles, Timer } from 'lucide-react';
import { LANDING_CARD } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const ITEMS = [
  { icon: Sparkles, text: 'No credit card required', accent: 'text-fuchsia-400' },
  { icon: Timer, text: 'Instant redirects', accent: 'text-amber-400' },
  { icon: Shield, text: 'Privacy-aware analytics', accent: 'text-violet-400' }
] as const;

export function TrustStrip() {
  return (
    <ScrollReveal>
      <div className="mb-16 grid grid-cols-1 gap-3 sm:grid-cols-3 md:mb-20">
        {ITEMS.map(({ icon: Icon, text, accent }) => (
          <div
            key={text}
            className={'flex items-center justify-center gap-3 px-5 py-4 backdrop-blur-sm ' + LANDING_CARD}
          >
            <Icon className={`h-4 w-4 ${accent}`} aria-hidden />
            <span className="text-sm text-violet-200/60">{text}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
