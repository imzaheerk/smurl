import { Key, Trash2, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui';
import { BASE_URL } from '../../../services/api';

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
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.2 }}
      className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
    >
      <div className="flex items-start gap-3 mb-4 sm:mb-6">
        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
          <Key className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
        </div>
        <div className="min-w-0">
          <h2 className="text-base sm:text-lg font-semibold text-white">API keys</h2>
          <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
            Use <code className="text-cyan-300/90 text-[10px] sm:text-xs">Authorization: Bearer &lt;key&gt;</code>. Keys are shown only once.
          </p>
        </div>
      </div>

      <form onSubmit={onCreateKey} className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
        <input
          type="text"
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          placeholder="e.g. Production server"
          maxLength={100}
          aria-label="API key name"
          className="flex-1 min-w-0 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
        />
        <Button
          type="submit"
          variant="primaryViolet"
          disabled={creatingKey}
          className="w-full sm:w-auto shrink-0"
        >
          {creatingKey ? 'Creating…' : 'Create key'}
        </Button>
      </form>

      {apiKeysLoading ? (
        <div className="py-6 sm:py-8 text-center text-slate-500 text-xs sm:text-sm">Loading keys…</div>
      ) : apiKeys.length === 0 ? (
        <div className="rounded-xl bg-slate-950/50 border border-white/5 py-6 sm:py-8 px-4 text-center">
          <Key className="w-8 h-8 sm:w-10 sm:h-10 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-500 text-xs sm:text-sm">No API keys yet.</p>
          <p className="text-slate-600 text-[11px] sm:text-xs mt-1">Create one above to use the API.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {apiKeys.map((k) => (
            <li
              key={k.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-3 hover:border-white/15 transition-colors"
            >
              <div className="min-w-0 flex-1">
                <span className="font-medium text-slate-200 block truncate text-sm">{k.name}</span>
                <span className="font-mono text-[11px] sm:text-xs text-slate-500">{k.keyPrefix}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {revokeConfirm === k.id ? (
                  <>
                    <span className="text-[10px] sm:text-xs text-amber-400 mr-1 hidden sm:inline">Revoke?</span>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => onRevokeKey(k.id)}
                      className="px-2 py-1.5 text-xs"
                    >
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
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl bg-slate-950/60 border border-white/5">
        <p className="text-[10px] sm:text-xs font-medium text-slate-400 mb-2">Example request</p>
        <pre className="overflow-x-auto text-cyan-300/90 font-mono text-[10px] sm:text-xs whitespace-pre rounded-lg bg-slate-950/80 p-2.5 sm:p-3 border border-white/5">
          {`curl -X POST ${BASE_URL}/url/shorten \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -d '{"url":"https://example.com/long-url"}'`}
        </pre>
        <p className="text-slate-500 text-[10px] sm:text-xs mt-2 flex items-center gap-1.5">
          <ShieldAlert className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
          Store your key securely. It can't be shown again.
        </p>
      </div>
    </motion.section>
  );
}
