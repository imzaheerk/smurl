import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import iconLinkIntelligence from '../../../assets/icon-link-intelligence.svg';
import iconBuiltForTeams from '../../../assets/icon-built-for-teams.svg';
import iconFastPrivacy from '../../../assets/icon-fast-privacy.svg';
import { ROUTES } from '../../../constants/routes';
import { LANDING_CARD, LANDING_FOCUS, LANDING_SCENE_PANEL, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';
import { FeatureChannelCard } from '../components/FeatureChannelCard';

const LandingTrustedCampaignsScene = lazy(() =>
  import('../components/LandingTrustedCampaignsScene').then((m) => ({
    default: m.LandingTrustedCampaignsScene
  }))
);

const FEATURES = [
  {
    icon: iconLinkIntelligence,
    title: 'Link intelligence',
    description:
      'Every click records geo, browser, and referrer so you can understand where your traffic really comes from.'
  },
  {
    icon: iconBuiltForTeams,
    title: 'Built for teams',
    description:
      'Share short links with your team, keep a searchable history, and standardize how your brand shows up everywhere.'
  },
  {
    icon: iconFastPrivacy,
    title: 'Fast & privacy‑aware',
    description:
      'Lightweight redirects, secure storage, and analytics that focus on performance, not invasive profiling.'
  },
  {
    lucide: KeyRound,
    title: 'API keys for developers',
    description: (
      <>
        Create API keys in Settings and shorten URLs from scripts or servers with{' '}
        <code className="max-sm:break-all max-sm:text-[10px] text-fuchsia-300/90">Authorization: Bearer &lt;key&gt;</code>. No browser
        login required.
      </>
    )
  }
] as const;

export function FeaturesSection() {
  return (
    <section id="features" className="scroll-mt-24 space-y-8">
      <ScrollReveal>
        <div className="mb-2 text-center">
          <p className={LANDING_SECTION_LABEL}>Why Smurl</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-fuchsia-300 to-amber-300 bg-clip-text text-transparent">
              own your links
            </span>
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-5">
        <ScrollReveal className="h-full lg:col-span-5">
          <div className="flex h-full min-h-[220px] flex-col justify-between rounded-3xl border border-white/[0.06] bg-gradient-to-br from-fuchsia-500/[0.06] to-transparent p-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-violet-400/50">
                Trusted on campaigns at
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {['Flowline Studio', 'Northwind Labs', 'Pixelwave Media', 'Aurora Collective'].map(
                  (name) => (
                    <span
                      key={name}
                      className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-[11px] text-violet-200/60"
                    >
                      {name}
                    </span>
                  )
                )}
              </div>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-violet-200/45">
              From solo creators to growth teams — Smurl keeps every campaign link fast, trackable,
              and on-brand.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100} className="lg:col-span-7">
          <div className={'min-h-[220px] ' + LANDING_SCENE_PANEL + ' lg:min-h-[260px]'}>
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_20%,rgba(232,121,249,0.12),transparent)]"
              aria-hidden
            />
            <Suspense
              fallback={
                <div className="min-h-[220px] w-full animate-pulse bg-violet-950/30 lg:min-h-[260px]" />
              }
            >
              <LandingTrustedCampaignsScene />
            </Suspense>
          </div>
        </ScrollReveal>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((feature, i) => (
          <ScrollReveal key={feature.title} delay={i * 100} className="h-full">
            <div
              className={
                LANDING_CARD +
                ' group h-full p-5 transition-colors hover:border-fuchsia-500/20 hover:bg-white/[0.04]'
              }
            >
              {'icon' in feature ? (
                <img src={feature.icon} alt="" className="h-10 w-10" />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-400">
                  <feature.lucide className="h-5 w-5" aria-hidden />
                </div>
              )}
              <h3 className="mt-3 text-sm font-semibold text-white">{feature.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-violet-200/50">{feature.description}</p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <FeatureChannelCard variant="email" label="Email campaign" />
        <FeatureChannelCard variant="social" label="Social post" />
        <FeatureChannelCard variant="qr" label="QR in print" />
        <FeatureChannelCard variant="api" label="Developer API" />
      </div>

      <ScrollReveal delay={200}>
        <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-gradient-to-r from-fuchsia-500/[0.06] via-transparent to-amber-500/[0.06] px-6 py-5 text-center md:flex-row md:text-left">
          <p className="text-sm text-violet-200/55">
            Sign up to unlock full analytics, history, and team‑ready features.
          </p>
          <div className="flex shrink-0 gap-2">
            <Link
              to={ROUTES.LOGIN}
              className={
                'inline-flex items-center rounded-xl border border-white/[0.1] px-4 py-2 text-xs font-medium text-violet-200/70 transition hover:border-fuchsia-400/40 hover:text-fuchsia-300 max-sm:min-h-[44px] max-sm:py-2.5 ' +
                LANDING_FOCUS
              }
            >
              Log in
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className={
                'inline-flex items-center rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/15 px-4 py-2 text-xs font-medium text-fuchsia-200 transition hover:bg-fuchsia-500/25 max-sm:min-h-[44px] max-sm:py-2.5 ' +
                LANDING_FOCUS
              }
            >
              Create account
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
