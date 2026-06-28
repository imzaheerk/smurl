import { Key, Trash2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';
import { BASE_URL } from '../../../services/api';
import { APP_CARD, APP_INPUT } from '../../../components/app/appTheme';

export interface ApiKeyItem {
  id: string;
  name: string;
  keyPrefix: string;
}

export interface ApiKeysSectionProps {
  newKeyName: string;
  setNewKeyName: (value: string) => void;
  creatingKey: boolean;
  onCreateKey: (e: React.FormEvent) => void;
  apiKeys: ApiKeyItem[];
  apiKeysLoading: boolean;
  revokeConfirm: string | null;
  setRevokeConfirm: (id: string | null) => void;
  onRevokeKey: (id: string) => void;
}

export function ApiKeysSection({
  newKeyName,
  setNewKeyName,
  creatingKey,
  onCreateKey,
  apiKeys,
  apiKeysLoading,
  revokeConfirm,
  setRevokeConfirm,
  onRevokeKey
}: ApiKeysSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={APP_CARD + ' p-4 sm:p-6'}
    >
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 sm:h-10 sm:w-10">
          <Key className="h-4 w-4 text-amber-300 sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-white sm:text-lg">API keys</h2>
          <p className="mt-0.5 text-xs text-violet-200/50 sm:text-sm">
            Use{' '}
            <code className="text-[10px] text-fuchsia-300/90 sm:text-xs">Authorization: Bearer &lt;key&gt;</code>. Keys
            are shown only once.
          </p>
        </div>
      </div>

      <form onSubmit={onCreateKey} className="mb-5 flex flex-col gap-3 sm:flex-row">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="e.g. Production server"
          maxLength={100}
          aria-label="API key name"
          className={APP_INPUT + ' min-w-0 flex-1'}
        />
        <Button type="submit" variant="primaryViolet" disabled={creatingKey} className="w-full shrink-0 sm:w-auto">
          {creatingKey ? 'Creating…' : 'Create key'}
        </Button>
      </form>

      {apiKeysLoading ? (
        <div className="py-8 text-center text-xs text-violet-400/45 sm:text-sm">Loading keys…</div>
      ) : apiKeys.length === 0 ? (
        <div className="rounded-xl border border-white/[0.04] bg-[#0a0514]/40 py-8 px-4 text-center">
          <Key className="mx-auto mb-2 h-8 w-8 text-violet-400/25 sm:h-10 sm:w-10" />
          <p className="text-xs text-violet-200/50 sm:text-sm">No API keys yet.</p>
          <p className="mt-1 text-[11px] text-violet-400/35 sm:text-xs">Create one above to use the API.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {apiKeys.map((k) => (
            <li
              key={k.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-white/[0.06] bg-[#0a0514]/60 px-4 py-3 transition-colors hover:border-white/10"
            >
              <div className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-violet-100/90">{k.name}</span>
                <span className="font-mono text-[11px] text-violet-400/45 sm:text-xs">{k.keyPrefix}</span>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {revokeConfirm === k.id ? (
                  <>
                    <span className="mr-1 hidden text-xs text-amber-400 sm:inline">Revoke?</span>
                    <Button type="button" variant="danger" onClick={() => onRevokeKey(k.id)} className="px-2 py-1.5 text-xs">
                      Yes
                    </Button>
                    <Button
                      type="button"
                      variant="secondaryGray"
                      onClick={() => setRevokeConfirm(null)}
                      className="px-2 py-1.5 text-xs"
                    >
                      No
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setRevokeConfirm(k.id)}
                    className="p-2"
                    aria-label={`Revoke ${k.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 rounded-xl border border-white/[0.04] bg-[#0a0514]/50 p-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-violet-400/45 sm:text-xs">
          Example request
        </p>
        <pre className="overflow-x-auto whitespace-pre rounded-lg border border-white/[0.04] bg-[#0a0514]/80 p-3 font-mono text-[10px] text-fuchsia-300/90 sm:text-xs">
          {`curl -X POST ${BASE_URL}/url/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url":"https://example.com/long-url"}'`}
        </pre>
        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-violet-400/45 sm:text-xs">
          <ShieldAlert className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
          Store your key securely. It can&apos;t be shown again.
        </p>
      </div>
    </motion.section>
  );
}
