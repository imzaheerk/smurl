import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { useAuth } from '../hooks/useAuth';
import api, { BASE_URL } from '../services/api';
import toast from 'react-hot-toast';
import { Dialog } from '@headlessui/react';
import { Globe, Key, Trash2, Copy, X, KeyRound, ShieldAlert, ArrowLeft, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CustomDomainRow {
  id: string;
  domain: string;
  verified: boolean;
  createdAt: string;
}

interface ApiKeyRow {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string;
}

type SettingsTab = 'api' | 'domains' | 'account';

function getEmailFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return typeof decoded?.email === 'string' ? decoded.email : null;
  } catch {
    return null;
  }
}

export const Settings = () => {
  const { token, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('api');
  const email = getEmailFromToken(token);

  const [domains, setDomains] = useState<CustomDomainRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState('');
  const [adding, setAdding] = useState(false);

  const [apiKeys, setApiKeys] = useState<ApiKeyRow[]>([]);
  const [apiKeysLoading, setApiKeysLoading] = useState(true);
  const [newKeyName, setNewKeyName] = useState('');
  const [creatingKey, setCreatingKey] = useState(false);
  const [newKeyReveal, setNewKeyReveal] = useState<{ key: string; name: string } | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);

  const fetchDomains = async () => {
    setLoading(true);
    try {
      const res = await api.get<CustomDomainRow[]>('/custom-domains');
      setDomains(res.data);
    } catch {
      toast.error('Failed to load custom domains');
    } finally {
      setLoading(false);
    }
  };

  const fetchApiKeys = async () => {
    setApiKeysLoading(true);
    try {
      const res = await api.get<ApiKeyRow[]>('/api-keys');
      setApiKeys(res.data);
    } catch {
      toast.error('Failed to load API keys');
    } finally {
      setApiKeysLoading(false);
    }
  };

  useEffect(() => {
    void fetchDomains();
    void fetchApiKeys();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    const domain = newDomain.trim();
    if (!domain) return;
    setAdding(true);
    try {
      await api.post('/custom-domains', { domain });
      toast.success(`Added ${domain}`);
      setNewDomain('');
      void fetchDomains();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg ?? 'Failed to add domain');
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteDomain = async (id: string) => {
    try {
      await api.delete(`/custom-domains/${id}`);
      toast.success('Domain removed');
      void fetchDomains();
    } catch {
      toast.error('Failed to remove domain');
    }
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = newKeyName.trim();
    if (!name) return;
    setCreatingKey(true);
    try {
      const res = await api.post<{
        id: string;
        name: string;
        key: string;
        keyPrefix: string;
        createdAt: string;
      }>('/api-keys', { name });
      setNewKeyReveal({ key: res.data.key, name: res.data.name });
      setNewKeyName('');
      void fetchApiKeys();
    } catch (err: unknown) {
      const msg =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      toast.error(msg ?? 'Failed to create API key');
    } finally {
      setCreatingKey(false);
    }
  };

  const handleRevokeKey = async (id: string) => {
    setRevokeConfirm(null);
    try {
      await api.delete(`/api-keys/${id}`);
      toast.success('API key revoked');
      void fetchApiKeys();
    } catch {
      toast.error('Failed to revoke key');
    }
  };

  const copyKeyToClipboard = async () => {
    if (!newKeyReveal) return;
    const text = newKeyReveal.key;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        toast.success('API key copied to clipboard');
        return;
      }
    } catch {
      /* clipboard API failed, use fallback */
    }
    // Fallback for mobile / insecure context: use execCommand
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.setSelectionRange(0, text.length);
    try {
      const ok = document.execCommand('copy');
      if (ok) toast.success('API key copied to clipboard');
      else toast.error('Copy failed. Select and copy the key manually.');
    } catch {
      toast.error('Copy failed. Select and copy the key manually.');
    }
    document.body.removeChild(textarea);
  };

  const tabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User className="w-4 h-4" /> },
    { id: 'api', label: 'API keys', icon: <KeyRound className="w-4 h-4" /> },
    { id: 'domains', label: 'Custom domains', icon: <Globe className="w-4 h-4" /> },
  ];

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-5 sm:mb-8"
          >
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 mb-4 sm:mb-6 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 rounded-lg px-1 py-0.5 touch-manipulation"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Back to Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">Settings</h1>
            <p className="text-slate-400 text-sm sm:text-base">Manage API keys and custom domains.</p>
          </motion.div>

          {/* Tabs - full width on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10 mb-4 sm:mb-6 w-full sm:w-fit"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium transition-all touch-manipulation ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'account' && (
              <motion.section
                key="account"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.2 }}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-xl"
              >
                <div className="flex items-start gap-3 mb-4 sm:mb-6">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-semibold text-white">Account</h2>
                    <p className="text-slate-400 text-xs sm:text-sm mt-0.5">
                      Signed-in account and session. Log out to use a different account.
                    </p>
                  </div>
                </div>

                <div className="rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-4 mb-4">
                  <p className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase tracking-wider mb-1.5">Signed in as</p>
                  <p className="text-slate-200 font-medium break-all">{email ?? '—'}</p>
                </div>

                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 min-h-[44px] px-4 py-3 sm:py-2.5 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-slate-300 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-300 transition-colors touch-manipulation"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </button>
              </motion.section>
            )}

            {activeTab === 'api' && (
              <motion.section
                key="api"
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

                <form onSubmit={handleCreateKey} className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g. Production server"
                    maxLength={100}
                    aria-label="API key name"
                    className="flex-1 min-w-0 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={creatingKey}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 touch-manipulation shrink-0"
                  >
                    {creatingKey ? 'Creating…' : 'Create key'}
                  </button>
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
                              <button
                                type="button"
                                onClick={() => handleRevokeKey(k.id)}
                                className="px-2 py-1.5 rounded-lg text-xs font-medium bg-red-500/20 text-red-300 border border-red-500/40 touch-manipulation"
                              >
                                Yes
                              </button>
                              <button
                                type="button"
                                onClick={() => setRevokeConfirm(null)}
                                className="px-2 py-1.5 rounded-lg text-xs font-medium bg-white/10 text-slate-400 touch-manipulation"
                              >
                                No
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setRevokeConfirm(k.id)}
                              className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 touch-manipulation"
                              aria-label={`Revoke ${k.name}`}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
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
                    Store your key securely. It can’t be shown again.
                  </p>
                </div>
              </motion.section>
            )}

            {activeTab === 'domains' && (
              <motion.section
                key="domains"
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

                <form onSubmit={handleAddDomain} className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
                  <input
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="go.yourbrand.com"
                    aria-label="Custom domain"
                    className="flex-1 min-w-0 rounded-xl bg-slate-950/80 border border-white/10 px-3 sm:px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                  <button
                    type="submit"
                    disabled={adding}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 touch-manipulation shrink-0"
                  >
                    {adding ? 'Adding…' : 'Add domain'}
                  </button>
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
                        <button
                          type="button"
                          onClick={() => handleDeleteDomain(d.id)}
                          className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 touch-manipulation shrink-0"
                          aria-label={`Remove ${d.domain}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* New API key reveal modal - mobile friendly */}
      <Dialog open={!!newKeyReveal} onClose={() => setNewKeyReveal(null)} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden="true" />
        <Dialog.Panel className="relative w-full sm:max-w-lg max-h-[90vh] sm:max-h-none bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-2xl border border-cyan-500/30 border-b-0 sm:border-b overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative p-4 sm:p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <Dialog.Title className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center shrink-0">
                  <Key className="w-4 h-4 text-cyan-400" />
                </div>
                API key created
              </Dialog.Title>
              <button
                type="button"
                onClick={() => setNewKeyReveal(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 touch-manipulation"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {newKeyReveal && (
              <>
                <p className="text-slate-400 text-xs sm:text-sm mb-3">Copy this key now. You won’t see it again.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-slate-950 border border-white/10 px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm text-cyan-300">
                  <span className="flex-1 min-w-0 break-all select-text" title={newKeyReveal.key}>
                    {newKeyReveal.key}
                  </span>
                  <button
                    type="button"
                    onClick={copyKeyToClipboard}
                    className="shrink-0 inline-flex items-center justify-center gap-2 min-h-[44px] w-full sm:w-auto px-4 py-3 sm:py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 active:bg-cyan-500/40 touch-manipulation font-medium text-sm border border-cyan-500/30"
                    aria-label="Copy API key"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy key</span>
                  </button>
                </div>
                <p className="mt-3 text-amber-400/90 text-[11px] sm:text-xs flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  Use <code className="bg-white/5 px-1 py-0.5 rounded text-[10px] sm:text-xs">Authorization: Bearer &lt;key&gt;</code>
                </p>
              </>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </Layout>
  );
};
