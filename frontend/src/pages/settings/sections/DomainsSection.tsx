import { Globe, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';
import { APP_CARD, APP_INPUT } from '../../../components/app/appTheme';

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
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={APP_CARD + ' p-4 sm:p-6'}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 sm:h-10 sm:w-10">
          <Globe className="h-4 w-4 text-violet-300 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white sm:text-lg">Custom domains</h2>
          <p className="mt-0.5 text-xs text-violet-200/50 sm:text-sm">
            Use your domain so links show as{' '}
            <strong className="text-violet-200/70">yourdomain.com/CODE</strong>.
          </p>
        </div>
      </div>

      <form onSubmit={onAddDomain} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newDomain}
          onChange={(e) => setNewDomain(e.target.value)}
          placeholder="go.yourbrand.com"
          aria-label="Custom domain"
          className={APP_INPUT + ' min-w-0 flex-1'}
        />
        <Button type="submit" variant="primaryViolet" disabled={adding} className="w-full shrink-0 sm:w-auto">
          {adding ? 'Adding…' : 'Add domain'}
        </Button>
      </form>

      {loading ? (
        <div className="py-8 text-center text-xs text-violet-400/45 sm:text-sm">Loading domains…</div>
      ) : domains.length === 0 ? (
        <div className="rounded-xl border border-white/[0.04] bg-[#0a0514]/40 py-8 px-4 text-center">
          <Globe className="mx-auto mb-2 h-8 w-8 text-violet-400/25 sm:h-10 sm:w-10" />
          <p className="text-xs text-violet-200/50 sm:text-sm">No custom domains yet.</p>
          <p className="mt-1 text-[11px] text-violet-400/35 sm:text-xs">Add one above to use your own host.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {domains.map((d) => (
            <li
              key={d.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0a0514]/60 px-4 py-3 transition-colors hover:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <span className="break-all font-mono text-xs text-fuchsia-300 sm:text-sm">{d.domain}</span>
                {!d.verified && (
                  <span className="ml-0 block text-[10px] text-amber-400 sm:ml-2 sm:inline sm:text-xs">
                    (unverified)
                  </span>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => onDeleteDomain(d.id)}
                className="shrink-0 p-2"
                aria-label={`Remove ${d.domain}`}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-xl border border-white/[0.04] bg-[#0a0514]/50 p-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-violet-400/45 sm:text-xs">
          How to connect
        </p>
        <ol className="list-inside list-decimal space-y-1.5 text-[11px] text-violet-200/45 sm:text-xs">
          <li>
            Add your domain above (e.g. <code className="text-fuchsia-300/90">go.yourbrand.com</code>).
          </li>
          <li>
            In DNS, add a <strong className="text-violet-200/60">CNAME</strong> to your Smurl host.
          </li>
          <li>
            Visits to <strong className="text-violet-200/60">https://go.yourbrand.com/CODE</strong> will use your
            links.
          </li>
        </ol>
      </div>
    </motion.section>
  );
}
