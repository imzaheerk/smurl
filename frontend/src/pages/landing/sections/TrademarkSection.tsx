import { Link } from 'react-router-dom';
import { SmurlBrand } from '../../../components/AppLogo';
import { ROUTES } from '../../../constants/routes';
import { LANDING_FOCUS } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

export function TrademarkSection() {
  return (
    <section
      className="relative mt-12 overflow-hidden py-8 md:mt-16 md:py-10"
      aria-label="Smurl trademark"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-24 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-fuchsia-600/10 blur-[100px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-amber-500/8 blur-[90px]"
        aria-hidden
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden" aria-hidden>
        <span
          className="select-none bg-gradient-to-r from-fuchsia-400/10 via-pink-400/8 to-amber-400/10 bg-clip-text text-[clamp(5.5rem,24vw,15rem)] font-semibold leading-none text-transparent"
          style={{ fontFamily: "'Dancing Script', cursive" }}
        >
          Smurl
        </span>
      </div>

      <ScrollReveal className="relative flex flex-col items-center text-center">
        <div className="flex w-full max-w-md items-center gap-4 px-4" aria-hidden>
          <span className="h-px flex-1 bg-gradient-to-r from-transparent to-fuchsia-500/30" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-fuchsia-400/50">
            Trademark
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent to-amber-400/30" />
        </div>

        <Link
          to={ROUTES.HOME}
          className={
            'group mt-6 inline-flex rounded-3xl p-2 transition-transform duration-500 hover:scale-[1.03] active:scale-[0.98] ' +
            LANDING_FOCUS
          }
          aria-label="Smurl home"
        >
          <div className="scale-[1.2] transition-transform duration-500 group-hover:scale-[1.25] sm:scale-[1.35] sm:group-hover:scale-[1.4]">
            <SmurlBrand size="xl" layout="vertical" glow />
          </div>
        </Link>

        <p className="mt-5 max-w-sm text-sm leading-relaxed text-violet-200/50">
          <span className="font-medium text-violet-100/80">
            Smurl<span className="align-super text-[10px] text-fuchsia-400/70">™</span>
          </span>{' '}
          is our mark for short links, QR codes, and click analytics — built for teams who care about
          clarity.
        </p>
      </ScrollReveal>
    </section>
  );
}
