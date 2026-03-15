import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { BackLink, Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import { Dialog } from '@headlessui/react';
import { Globe, Key, Copy, X, KeyRound, ShieldAlert, ArrowLeft, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from './hooks/useSettings';
import { AccountSection, ApiKeysSection, DomainsSection } from './sections';

type SettingsTab = 'api' | 'domains' | 'account';

export const Settings = () => {
  const { token, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('api');
  const {
    email,
    domains,
    loading,
    newDomain,
    setNewDomain,
    adding,
    apiKeys,
    apiKeysLoading,
    newKeyName,
    setNewKeyName,
    creatingKey,
    newKeyReveal,
    setNewKeyReveal,
    revokeConfirm,
    setRevokeConfirm,
    handleAddDomain,
    handleDeleteDomain,
    handleCreateKey,
    handleRevokeKey,
    copyKeyToClipboard
  } = useSettings(token);

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
            <BackLink to={ROUTES.DASHBOARD} theme="cyan">
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              Back to Dashboard
            </BackLink>
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
              <AccountSection key="account" email={email} onLogout={logout} />
            )}
            {activeTab === 'api' && (
              <ApiKeysSection
                key="api"
                newKeyName={newKeyName}
                setNewKeyName={setNewKeyName}
                creatingKey={creatingKey}
                onCreateKey={handleCreateKey}
                apiKeys={apiKeys}
                apiKeysLoading={apiKeysLoading}
                revokeConfirm={revokeConfirm}
                setRevokeConfirm={setRevokeConfirm}
                onRevokeKey={handleRevokeKey}
              />
            )}
            {activeTab === 'domains' && (
              <DomainsSection
                key="domains"
                newDomain={newDomain}
                setNewDomain={setNewDomain}
                adding={adding}
                onAddDomain={handleAddDomain}
                domains={domains}
                loading={loading}
                onDeleteDomain={handleDeleteDomain}
              />
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
              <Button
                type="button"
                variant="ghost"
                onClick={() => setNewKeyReveal(null)}
                className="p-2"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            {newKeyReveal && (
              <>
                <p className="text-slate-400 text-xs sm:text-sm mb-3">Copy this key now. You won't see it again.</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl bg-slate-950 border border-white/10 px-3 sm:px-4 py-3 font-mono text-xs sm:text-sm text-cyan-300">
                  <span className="flex-1 min-w-0 break-all select-text" title={newKeyReveal.key}>
                    {newKeyReveal.key}
                  </span>
                  <Button
                    type="button"
                    variant="secondaryCyan"
                    onClick={copyKeyToClipboard}
                    className="shrink-0 min-h-[44px] w-full sm:w-auto px-4 py-3 sm:py-2.5 gap-2"
                    aria-label="Copy API key"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy key</span>
                  </Button>
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
