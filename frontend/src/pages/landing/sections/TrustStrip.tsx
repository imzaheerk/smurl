import { Sparkles } from 'lucide-react';
import { ScrollReveal } from './ScrollReveal';

export function TrustStrip() {
  return (
    <ScrollReveal>
      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 py-6 text-xs text-slate-500 border-y border-slate-800/80">
        <span className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-teal-400/80" aria-hidden />
          No credit card required
        </span>
        <span className="hidden sm:inline text-slate-600" aria-hidden>·</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400/80" aria-hidden />
          Free to start
        </span>
        <span className="hidden sm:inline text-slate-600" aria-hidden>·</span>
        <span>Analytics & QR included</span>
      </div>
    </ScrollReveal>
  );
}
