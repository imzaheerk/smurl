import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Privacy Policy</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: 2026</p>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 space-y-4 text-sm">
          <p>
            Smurl (“we”) respects your privacy. This policy describes what data we collect and how we use it when you use our URL shortening and analytics services.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Data we collect</h2>
          <p>
            We store the long URLs you shorten, optional custom short codes, and—if you use an account—link history and settings. For analytics we record click timestamps and anonymized metadata (e.g. country, browser, referrer) derived from requests to short links. We do not store the content of pages you link to.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">How we use it</h2>
          <p>
            We use this data to provide redirects, show you analytics, improve our service, and comply with law. We do not sell your data to third parties for marketing.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Security and retention</h2>
          <p>
            Passwords are hashed; API keys are stored in hashed form. We retain link and analytics data for as long as your account exists or the link is active; you can delete links or request account deletion.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Accessibility</h2>
          <p>
            We aim to make Smurl accessible. If you encounter barriers, please contact us and we will work to address them.
          </p>
          <p className="mt-8">
            <Link to="/" className="text-teal-400 hover:underline">Return to Smurl</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
