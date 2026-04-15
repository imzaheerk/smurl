import { useLandingShorten } from './hooks/useLandingShorten';
import {
  LandingHeader,
  HeroShortenSection,
  TrustStrip,
  FeaturesSection,
  BuiltForSection,
  HowItWorksSection,
  FaqSection,
  LandingFooter
} from './sections';

export const Landing = () => {
  const { url, setUrl, shortUrl, loading, copied, handleSubmit, copyToClipboard, downloadQR } = useLandingShorten();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 bg-grid bg-gradient-to-b from-slate-950/95 via-slate-950/90 to-slate-900/95">
      {/* Soft ambient wash (hero carries primary 3D) */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-500/8 blur-[100px] animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute -right-32 top-1/3 h-72 w-72 rounded-full bg-sky-500/7 blur-[90px] animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 left-1/3 h-64 w-64 rounded-full bg-violet-500/6 blur-[80px] animate-[pulse_9s_ease-in-out_infinite]" />
      </div>

      <LandingHeader />

      <main className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
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

        <FeaturesSection />
        <BuiltForSection />
        <HowItWorksSection />
        <FaqSection />
        <LandingFooter />
      </main>
    </div>
  );
};
