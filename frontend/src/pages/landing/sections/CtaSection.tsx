import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ROUTES } from '../../../constants/routes';
import { LANDING_BTN_PRIMARY, LANDING_FOCUS } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

export function CtaSection() {
  return (
    <section className="mt-20 md:mt-28" aria-label="Get started">
      <ScrollReveal>
        <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-500/[0.12] via-[#0c0818] to-amber-500/[0.08] px-6 py-12 text-center md:px-12 md:py-16">
          <div
            className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-500/15 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"
            aria-hidden
          />

          <div className="relative">
            <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-fuchsia-500/25 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-fuchsia-300/90">
              <Sparkles className="h-3 w-3" aria-hidden />
              Free to start
            </p>
            <h2 className="text-2xl font-bold text-white md:text-4xl">
              Ready to shorten your first link?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm text-violet-200/55 md:text-base">
              Try it on this page without signing up — or create a free account for analytics,
              history, custom domains, and API access.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a href="#shorten" className={LANDING_BTN_PRIMARY + ' px-6'}>
                Try the playground
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
              <Link
                to={ROUTES.REGISTER}
                className={
                  'inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold text-violet-100 transition hover:border-fuchsia-400/40 hover:bg-white/10 ' +
                  LANDING_FOCUS
                }
              >
                Create free account
              </Link>
            </div>
            <p className="mt-5 text-xs text-violet-400/45">
              No credit card · Analytics & QR included · Cancel anytime
            </p>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
