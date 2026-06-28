import { useLandingShorten } from './hooks/useLandingShorten';
import {
  LandingHeader,
  HeroShortenSection,
  TrustStrip,
  StatsSection,
  FeaturesSection,
  BuiltForSection,
  AnalyticsPreviewSection,
  UseCasesSection,
  HowItWorksSection,
  CtaSection,
  FaqSection,
  ReviewsSection,
  TrademarkSection,
  LandingFooter
} from './sections';

export const Landing = () => {
  const { url, setUrl, shortUrl, loading, copied, handleSubmit, copyToClipboard, downloadQR } = useLandingShorten();

  return (
    <div className="min-h-screen overflow-x-clip bg-[#0a0514] text-white antialiased">
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-amber-500/8 blur-[100px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/3 left-1/4 h-72 w-72 rounded-full bg-violet-600/8 blur-[90px] animate-[pulse_9s_ease-in-out_infinite]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '56px 56px'
          }}
        />
      </div>

      <LandingHeader />

      <main className="relative mx-auto max-w-7xl px-4 md:px-6">
        <HeroShortenSection
          url={url}
          setUrl={setUrl}
          shortUrl={shortUrl}
          loading={loading}
          copied={copied}
          handleSubmit={handleSubmit}
          copyToClipboard={copyToClipboard}
          downloadQR={downloadQR}
        />

        <TrustStrip />
        <StatsSection />
        <FeaturesSection />
        <BuiltForSection />
        <AnalyticsPreviewSection />
        <UseCasesSection />
        <HowItWorksSection />
        <CtaSection />
        <FaqSection />
        <ReviewsSection />
        <TrademarkSection />
        <LandingFooter />
      </main>
    </div>
  );
};
