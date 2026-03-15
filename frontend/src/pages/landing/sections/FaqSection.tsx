import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { CARD_SLATE_XL } from '../../../constants/styles';
import { ScrollReveal } from './ScrollReveal';

const FAQ_ITEMS = [
  {
    q: 'What is Smurl?',
    a: 'Smurl is a URL shortener that turns long links into short, shareable URLs. You can use it for campaigns, social posts, and print (via QR codes), with optional analytics when you create a free account.'
  },
  {
    q: 'How does Smurl work?',
    a: 'Paste any long URL on the landing page or in your dashboard. Smurl generates a short link (e.g. smurl.to/abc12) that redirects to your original URL. You can share the short link or its QR code anywhere. If you\'re logged in, every click is recorded for analytics.'
  },
  {
    q: 'What are the benefits of using Smurl?',
    a: 'Short links look cleaner in emails and social posts, are easier to type for print or verbal sharing, and can be tracked. With an account you get click analytics (country, browser, referrer), QR codes, a searchable link history, and the option to use custom domains.'
  },
  {
    q: 'Is Smurl free?',
    a: 'Yes. You can shorten links without an account. Creating a free account unlocks analytics, link history, QR codes, and more. We may offer premium plans later for higher limits or team features.'
  },
  {
    q: 'Do I need an account to shorten links?',
    a: 'No. You can shorten a URL once from the landing page without signing up. To save links, view analytics, and manage QR codes or custom domains, create a free account.'
  },
  {
    q: 'Can I use my own domain?',
    a: 'Yes. With a Smurl account you can add and verify custom domains so your short links use your brand (e.g. links.yourbrand.com/xyz) instead of smurl.to.'
  },
  {
    q: 'Is my data secure?',
    a: 'We store only what\'s needed for redirects and analytics: the destination URL, click timestamps, and anonymized metadata (country, browser, referrer). Passwords are hashed; we don\'t store or inspect the content of the pages you link to.'
  }
] as const;

export function FaqSection() {
  return (
    <section id="faq" className="mt-20 border-t border-slate-800 pt-12 scroll-mt-24">
      <ScrollReveal>
        <h2 className="text-base md:text-lg font-semibold text-slate-50 mb-6">
          Frequently asked questions
        </h2>
        <ul className="space-y-2 text-sm">
          {FAQ_ITEMS.map((faq, i) => (
            <li key={i}>
              <Disclosure as="div" className={CARD_SLATE_XL}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left text-slate-200 hover:bg-slate-800/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-inset transition-colors">
                      <span className="font-medium pr-2">{faq.q}</span>
                      <ChevronDownIcon className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} aria-hidden />
                    </DisclosureButton>
                    <DisclosurePanel className="px-4 pb-3.5 pt-0 text-slate-400 border-t border-slate-800/80">
                      {faq.a}
                    </DisclosurePanel>
                  </>
                )}
              </Disclosure>
            </li>
          ))}
        </ul>
      </ScrollReveal>
    </section>
  );
}
