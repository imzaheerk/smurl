import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import {
  BarChart3,
  ChevronDown,
  CircleHelp,
  Globe,
  KeyRound,
  Link2,
  Mail,
  Shield,
  Sparkles,
  Wallet
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/routes';
import { LANDING_BTN_SECONDARY, LANDING_FOCUS, LANDING_SECTION_LABEL } from '../constants/theme';
import { ScrollReveal } from './ScrollReveal';

const FAQ_ITEMS = [
  {
    q: 'What is Smurl?',
    a: 'Smurl is a URL shortener that turns long links into short, shareable URLs. You can use it for campaigns, social posts, and print (via QR codes), with optional analytics when you create a free account.',
    icon: Sparkles,
    tag: 'Basics'
  },
  {
    q: 'How does Smurl work?',
    a: 'Paste any long URL on the landing page or in your dashboard. Smurl generates a short link (e.g. smurl.to/abc12) that redirects to your original URL. You can share the short link or its QR code anywhere. If you\'re logged in, every click is recorded for analytics.',
    icon: Link2,
    tag: 'Basics'
  },
  {
    q: 'Is Smurl free?',
    a: 'Yes. You can shorten links without an account. Creating a free account unlocks analytics, link history, QR codes, and more. We may offer premium plans later for higher limits or team features.',
    icon: Wallet,
    tag: 'Pricing'
  },
  {
    q: 'Do I need an account to shorten links?',
    a: 'No. You can shorten a URL once from the landing page without signing up. To save links, view analytics, and manage QR codes or custom domains, create a free account.',
    icon: CircleHelp,
    tag: 'Basics'
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. With a Smurl account you can add and verify custom domains so your short links use your brand (e.g. links.yourbrand.com/xyz) instead of smurl.to.',
    icon: Globe,
    tag: 'Branding'
  },
  {
    q: 'Is my data secure?',
    a: 'We store only what\'s needed for redirects and analytics: the destination URL, click timestamps, and anonymized metadata (country, browser, referrer). Passwords are hashed; we don\'t store or inspect the content of the pages you link to.',
    icon: Shield,
    tag: 'Security'
  },
  {
    q: 'How do API keys work?',
    a: 'After you log in, go to Settings to create an API key. Send it as a Bearer token in the Authorization header when calling the shorten endpoint from scripts, servers, or automation tools — no browser session required.',
    icon: KeyRound,
    tag: 'Developers'
  },
  {
    q: 'What analytics do I get?',
    a: 'For each click we record timestamp, country (from IP), browser, and referrer. You can filter by date range in the dashboard and see trends over time. We don\'t track users across sites or sell click data.',
    icon: BarChart3,
    tag: 'Analytics'
  }
] as const;

function FaqItem({ faq, index }: { faq: (typeof FAQ_ITEMS)[number]; index: number }) {
  const Icon = faq.icon;

  return (
    <ScrollReveal delay={index * 45} className="h-full">
      <Disclosure as="div" className="h-full">
        {({ open }) => (
          <div
            className={
              'group h-full overflow-hidden rounded-2xl border backdrop-blur-sm transition-colors ' +
              (open
                ? 'border-fuchsia-500/25 bg-fuchsia-500/[0.04]'
                : 'border-white/[0.06] bg-[#0c0818]/50 hover:border-white/[0.1]')
            }
          >
            <DisclosureButton
              className={
                'flex w-full items-start gap-3 px-4 py-4 text-left sm:gap-4 sm:px-5 sm:py-4 ' +
                LANDING_FOCUS
              }
            >
              <span
                className={
                  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ' +
                  (open
                    ? 'border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-300'
                    : 'border-white/[0.08] bg-white/[0.03] text-violet-400/70 group-hover:border-fuchsia-500/20 group-hover:text-fuchsia-300/80')
                }
                aria-hidden
              >
                <Icon className="h-4 w-4" />
              </span>

              <span className="min-w-0 flex-1">
                <span className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-violet-400/55">
                    {faq.tag}
                  </span>
                </span>
                <span className="block pr-2 text-sm font-semibold text-violet-100/95 sm:text-[15px]">
                  {faq.q}
                </span>
              </span>

              <span
                className={
                  'mt-1 flex h-8 w-8 max-sm:h-10 max-sm:w-10 shrink-0 items-center justify-center rounded-lg border transition-all duration-200 ' +
                  (open
                    ? 'rotate-180 border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-300'
                    : 'border-white/[0.06] bg-white/[0.02] text-violet-400/50')
                }
                aria-hidden
              >
                <ChevronDown className="h-4 w-4" />
              </span>
            </DisclosureButton>

            <DisclosurePanel className="border-t border-white/[0.06] px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pl-[4.25rem]">
              <p className="text-sm leading-relaxed text-violet-200/55">{faq.a}</p>
            </DisclosurePanel>
          </div>
        )}
      </Disclosure>
    </ScrollReveal>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="relative mt-20 scroll-mt-24 md:mt-28" aria-label="Frequently asked questions">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/20 to-transparent"
        aria-hidden
      />

      <ScrollReveal>
        <div className="mb-10 text-center">
          <p className={LANDING_SECTION_LABEL}>FAQ</p>
          <h2 className="mt-2 text-2xl font-bold text-white md:text-3xl">
            Questions? We&apos;ve got answers.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-violet-200/50">
            Everything you need to know about shortening links, analytics, domains, and the API.
          </p>
        </div>
      </ScrollReveal>

      <div className="relative overflow-hidden rounded-3xl border border-white/[0.06] bg-[#0c0818]/40 p-4 max-sm:p-3 sm:p-6 md:p-8">
        <div
          className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-fuchsia-600/10 blur-[90px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-500/8 blur-[80px]"
          aria-hidden
        />

        <div className="relative grid grid-cols-1 gap-3 lg:grid-cols-2 lg:gap-4">
          {FAQ_ITEMS.map((faq, i) => (
            <FaqItem key={faq.q} faq={faq} index={i} />
          ))}
        </div>

        <ScrollReveal delay={120} className="relative mt-6 lg:col-span-2">
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-fuchsia-500/15 bg-gradient-to-r from-fuchsia-500/[0.08] via-[#0a0514]/40 to-amber-500/[0.06] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
            <div className="flex items-start gap-3 sm:items-center">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-400">
                <Mail className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Still have questions?</p>
                <p className="mt-0.5 text-xs text-violet-200/50">
                  Our team usually replies within one business day.
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <a
                href="mailto:support@smurl.app"
                className={LANDING_BTN_SECONDARY + ' min-h-[44px] w-full justify-center px-5 sm:w-auto'}
              >
                Email support
              </a>
              <Link
                to={ROUTES.REGISTER}
                className={
                  'inline-flex min-h-[44px] w-full items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-5 text-sm font-semibold text-violet-200/80 transition hover:border-fuchsia-500/25 hover:bg-white/[0.06] hover:text-fuchsia-200 sm:w-auto ' +
                  LANDING_FOCUS
                }
              >
                Create free account
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
