import { Globe, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';

export interface DomainItem {
  id: string;
  domain: string;
  verified: boolean;
}

export interface DomainsSectionProps {
  newDomain: string;
  setNewDomain: (value: string) => void;
  adding: boolean;
  onAddDomain: (e: React.FormEvent) => void;
  domains: DomainItem[];
  loading: boolean;
  onDeleteDomain: (id: string) => void;
}

export function DomainsSection({
  newDomain,
  setNewDomain,
  adding,
  onAddDomain,
  domains,
  loading,
  onDeleteDomain
}: DomainsSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
    >
      <div className="flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center shrink-0">
          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-fuchsia-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white">Custom domains</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Use your domain so links show as <strong className="text-slate-300">yourdomain.com/CODE</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={onAddDomain} className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="go.yourbrand.com"
          aria-label="Custom domain"
          className="flex-1 min-w-0 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <Button
          type="submit"
          variant="primaryViolet"
          disabled={adding}
          className="w-full sm:w-auto shrink-0"
        >
          {adding ? 'Adding…' : 'Add domain'}
        </Button>
      </form>

      {loading ? (
        <div className="py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">Loading domains…</div>
      ) : domains.length === 0 ? (
        <div className="rounded-xl bg-slate-950/50 border border-white/5 py-6 sm:py-8 px-4 text-center">
          <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-xs sm:text-sm">No custom domains yet.</p>
          <p className="text-slate-600 text-[11px] sm:text-xs mt-1">Add one above to use your own host.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {domains.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-3 hover:border-white/15 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="font-mono text-cyan-300 text-xs sm:text-sm break-all">{d.domain}</span>
                {!d.verified && (
                  <span className="ml-0 sm:ml-2 block sm:inline text-[10px] sm:text-xs text-amber-400">(unverified)</span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDeleteDomain(d.id)}
                className="p-2 shrink-0"
                aria-label={`Remove ${d.domain}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-white/5">
        <p className="text-[10px] sm:text-xs font-medium text-slate-400 mb-2">How to connect</p>
        <ol className="list-decimal list-inside text-slate-500 text-[11px] sm:text-xs space-y-1.5">
          <li>Add your domain above (e.g. <code className="text-cyan-300/90">go.yourbrand.com</code>).</li>
          <li>In DNS, add a <strong className="text-slate-400">CNAME</strong> to your Smurl host.</li>
          <li>Visits to <strong className="text-slate-400">https://go.yourbrand.com/CODE</strong> will use your links.</li>
        </ol>
      </div>
    </motion.section>
  );
}
