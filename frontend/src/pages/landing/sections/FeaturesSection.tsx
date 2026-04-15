import { lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import iconLinkIntelligence from '../../../assets/icon-link-intelligence.svg';
import iconBuiltForTeams from '../../../assets/icon-built-for-teams.svg';
import iconFastPrivacy from '../../../assets/icon-fast-privacy.svg';
import { ROUTES } from '../../../constants/routes';
import { LINK_HOVER_FOCUS } from '../../../constants/styles';
import { ScrollReveal } from './ScrollReveal';
import { FeatureChannelCard } from '../components/FeatureChannelCard';

const LandingTrustedCampaignsScene = lazy(() =>
  import('../components/LandingTrustedCampaignsScene').then((m) => ({
    default: m.LandingTrustedCampaignsScene
  }))
);

export function FeaturesSection() {
  return (
    <section id="features" className="space-y-6 scroll-mt-24 pt-8">
      <ScrollReveal>
        <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col justify-center gap-4 lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Trusted on campaigns at
            </p>
            <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
              <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                Flowline Studio
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                Northwind Labs
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                Pixelwave Media
              </span>
              <span className="rounded-full border border-slate-700/80 bg-slate-950/80 px-3 py-1">
                Aurora Collective
              </span>
            </div>
          </div>
          <div className="relative min-h-[180px] overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-950/55 shadow-[0_20px_70px_rgba(2,6,23,0.55)] lg:col-span-7">
            <div
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_65%_55%_at_50%_20%,rgba(56,189,248,0.1),transparent)]"
              aria-hidden
            />
            <Suspense
              fallback={
                <div className="min-h-[180px] w-full animate-pulse bg-slate-900/40 md:min-h-[220px]" />
              }
            >
              <LandingTrustedCampaignsScene />
            </Suspense>
            <div
              className="pointer-events-none absolute bottom-2 left-3 right-3 flex justify-between text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-600"
              aria-hidden
            >
              <span>Campaigns</span>
              <span>Reach</span>
              <span>Trust</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 gap-5 text-xs text-slate-400 md:grid-cols-2 lg:grid-cols-4">
        <ScrollReveal>
          <div className="space-y-1.5">
            <img src={iconLinkIntelligence} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">Link intelligence</h3>
            <p>
              Every click records geo, browser, and referrer so you can understand where your
              traffic really comes from.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <div className="space-y-1.5">
            <img src={iconBuiltForTeams} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">Built for teams</h3>
            <p>
              Share short links with your team, keep a searchable history, and standardize how your
              brand shows up everywhere.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <div className="space-y-1.5">
            <img src={iconFastPrivacy} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-sm font-semibold text-slate-100">Fast & privacy‑aware</h3>
            <p>
              Lightweight redirects, secure storage, and analytics that focus on performance, not
              invasive profiling.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={320}>
          <div className="space-y-1.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-teal-400/30 bg-teal-500/10 text-teal-400">
              <KeyRound className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-sm font-semibold text-slate-100">API keys for developers</h3>
            <p>
              Create API keys in Settings and shorten URLs from scripts or servers with{' '}
              <code className="text-teal-300/90">Authorization: Bearer &lt;key&gt;</code>. No browser
              login required.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 text-[11px] text-slate-300 md:grid-cols-2 lg:grid-cols-4">
        <FeatureChannelCard variant="email" label="Email campaign" />
        <FeatureChannelCard variant="social" label="Social post" />
        <FeatureChannelCard variant="qr" label="QR in print" />
        <FeatureChannelCard variant="api" label="Developer API" />
      </div>

      <ScrollReveal delay={260}>
        <div className="mt-6 flex flex-col gap-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>Sign up to unlock full analytics, history, and team‑ready features.</p>
          <div className="flex gap-2">
            <Link
              to={ROUTES.LOGIN}
              className={`rounded-lg border border-slate-700 px-3 py-1.5 hover:border-teal-400 ${LINK_HOVER_FOCUS}`}
            >
              Log in
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className={`rounded-lg border border-teal-500/60 bg-slate-900 px-3 py-1.5 hover:bg-slate-800 ${LINK_HOVER_FOCUS}`}
            >
              Create account
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
