import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export const Terms = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-white/5 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 text-sm font-medium text-teal-400 hover:text-teal-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Terms of Service</h1>
        <p className="text-slate-500 text-sm mb-8">Last updated: 2026</p>
        <div className="prose prose-invert prose-slate max-w-none text-slate-300 space-y-4 text-sm">
          <p>
            Welcome to Smurl. By using our URL shortening and related services ("Services"), you agree to these Terms of Service.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Use of the service</h2>
          <p>
            You may use Smurl to create short links, QR codes, and view analytics in accordance with these terms and our Privacy Policy. You must not use the Services for illegal content, spam, phishing, malware, or to violate any applicable laws or third-party rights.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Account and data</h2>
          <p>
            When you create an account, you are responsible for keeping your credentials secure. We store only the data necessary to provide the Services (e.g. destination URLs, click analytics). You may delete your data by removing links or contacting us.
          </p>
          <h2 className="text-slate-100 font-semibold mt-6">Changes</h2>
          <p>
            We may update these terms from time to time. Continued use of the Services after changes constitutes acceptance. For material changes we will provide notice where appropriate.
          </p>
          <p className="mt-8">
            <Link to={ROUTES.HOME} className="text-teal-400 hover:underline">Return to Smurl</Link>
          </p>
        </div>
      </main>
    </div>
  );
};
