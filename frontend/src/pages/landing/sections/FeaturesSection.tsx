import { Link } from 'react-router-dom';
import { KeyRound } from 'lucide-react';
import iconLinkIntelligence from '../../../assets/icon-link-intelligence.svg';
import iconBuiltForTeams from '../../../assets/icon-built-for-teams.svg';
import iconFastPrivacy from '../../../assets/icon-fast-privacy.svg';
import iconEmailCampaign from '../../../assets/icon-email-campaign.svg';
import iconSocialPost from '../../../assets/icon-social-post.svg';
import iconQrPrint from '../../../assets/icon-qr-print.svg';
import { ROUTES } from '../../../constants/routes';
import { LINK_HOVER_FOCUS } from '../../../constants/styles';
import { Card } from '../../../components/ui';
import { ScrollReveal } from './ScrollReveal';

export function FeaturesSection() {
  return (
    <section id="features" className="pt-8 space-y-6 scroll-mt-24">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
          Trusted on campaigns at
        </p>
        <div className="flex flex-wrap gap-3 text-[11px] text-slate-400">
          <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">Flowline Studio</span>
          <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">Northwind Labs</span>
          <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">Pixelwave Media</span>
          <span className="px-3 py-1 rounded-full border border-slate-700/80 bg-slate-950/80">Aurora Collective</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-xs text-slate-400">
        <ScrollReveal>
          <div className="space-y-1.5">
            <img src={iconLinkIntelligence} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-slate-100 text-sm font-semibold">Link intelligence</h3>
            <p>
              Every click records geo, browser, and referrer so you can understand where your
              traffic really comes from.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={120}>
          <div className="space-y-1.5">
            <img src={iconBuiltForTeams} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-slate-100 text-sm font-semibold">Built for teams</h3>
            <p>
              Share short links with your team, keep a searchable history, and standardize how
              your brand shows up everywhere.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={220}>
          <div className="space-y-1.5">
            <img src={iconFastPrivacy} alt="" className="h-10 w-10 text-teal-400" />
            <h3 className="text-slate-100 text-sm font-semibold">Fast & privacy‑aware</h3>
            <p>
              Lightweight redirects, secure storage, and analytics that focus on performance,
              not invasive profiling.
            </p>
          </div>
        </ScrollReveal>
        <ScrollReveal delay={320}>
          <div className="space-y-1.5">
            <div className="h-10 w-10 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center text-teal-400">
              <KeyRound className="h-5 w-5" aria-hidden />
            </div>
            <h3 className="text-slate-100 text-sm font-semibold">API keys for developers</h3>
            <p>
              Create API keys in Settings and shorten URLs from scripts or servers with{' '}
              <code className="text-teal-300/90">Authorization: Bearer &lt;key&gt;</code>. No browser login required.
            </p>
          </div>
        </ScrollReveal>
      </div>

      <ScrollReveal delay={180}>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-[11px] text-slate-300">
          <Card padding="p3" shadow className="text-[11px] text-slate-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">Email campaign</p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconEmailCampaign} alt="" className="h-12 w-12" />
                </div>
              </Card>
              <Card padding="p3" shadow className="text-[11px] text-slate-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">Social post</p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconSocialPost} alt="" className="h-12 w-12" />
                </div>
              </Card>
              <Card padding="p3" shadow className="text-[11px] text-slate-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">QR in print</p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <img src={iconQrPrint} alt="" className="h-12 w-12" />
                </div>
              </Card>
              <Card padding="p3" shadow className="text-[11px] text-slate-300">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 mb-2">Developer API</p>
                <div className="rounded-xl bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 p-3 flex items-center justify-center min-h-[80px]">
                  <div className="h-12 w-12 rounded-xl bg-teal-500/10 border border-teal-400/30 flex items-center justify-center">
                    <KeyRound className="h-7 w-7 text-teal-300" aria-hidden />
                  </div>
                </div>
              </Card>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={260}>
        <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-slate-500">
          <p>Sign up to unlock full analytics, history, and team‑ready features.</p>
          <div className="flex gap-2">
            <Link to={ROUTES.LOGIN} className={`px-3 py-1.5 rounded-lg border border-slate-700 hover:border-teal-400 ${LINK_HOVER_FOCUS}`}>
              Log in
            </Link>
            <Link to={ROUTES.REGISTER} className={`px-3 py-1.5 rounded-lg bg-slate-900 border border-teal-500/60 hover:bg-slate-800 ${LINK_HOVER_FOCUS}`}>
              Create account
            </Link>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}
