import { KeyRound, Megaphone, Users } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { ScrollReveal } from './ScrollReveal';
import { BuiltForCard } from './BuiltForCard';

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
        <h2 className="text-center text-base md:text-lg font-semibold text-slate-50 mb-6">
          Built for how you work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {CARDS.map((card) => (
            <BuiltForCard key={card.title} {...card} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  );
}
