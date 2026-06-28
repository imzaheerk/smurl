import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { Button } from '../../components/ui';
import { useAuth } from '../../hooks/useAuth';
import { Dialog } from '@headlessui/react';
import { Globe, Key, Copy, X, KeyRound, ShieldAlert, User } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useSettings } from './hooks/useSettings';
import { AccountSection, ApiKeysSection, DomainsSection } from './sections';
import {
  APP_CARD,
  APP_TAB_ACTIVE,
  APP_TAB_INACTIVE,
  LANDING_SECTION_LABEL
} from '../../components/app/appTheme';

type SettingsTab = 'api' | 'domains' | 'account';

export const Settings = () => {
  const { token, logout } = useAuth(true);
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
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
    { id: 'account', label: 'Account', icon: <User className="h-4 w-4" /> },
    { id: 'api', label: 'API keys', icon: <KeyRound className="h-4 w-4" /> },
    { id: 'domains', label: 'Domains', icon: <Globe className="h-4 w-4" /> }
  ];

  return (
    <Layout>
      <header className="mb-6 sm:mb-8">
        <p className={LANDING_SECTION_LABEL}>Preferences</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">Settings</h1>
        <p className="mt-1.5 text-sm text-violet-200/50 sm:text-base">
          Manage your account, API keys, and custom domains.
        </p>
      </header>

      <div className="mx-auto max-w-2xl">
        <nav
          className={APP_CARD + ' mb-5 flex gap-1 p-1 sm:mb-6'}
          aria-label="Settings sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium transition-all touch-manipulation sm:flex-none sm:px-4 sm:text-sm ' +
                (activeTab === tab.id ? APP_TAB_ACTIVE : APP_TAB_INACTIVE)
              }
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

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

      <Dialog
        open={!!newKeyReveal}
        onClose={() => setNewKeyReveal(null)}
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
        <Dialog.Panel className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border border-fuchsia-500/20 border-b-0 bg-[#0c0818] shadow-2xl sm:max-h-none sm:max-w-lg sm:rounded-2xl sm:border-b">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent" />
          <div className="relative overflow-y-auto p-5 sm:p-6">
            <div className="mb-4 flex items-center justify-between">
              <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-white sm:text-lg">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10">
                  <Key className="h-4 w-4 text-fuchsia-400" />
                </span>
                API key created
              </Dialog.Title>
              <Button type="button" variant="ghost" onClick={() => setNewKeyReveal(null)} aria-label="Close">
                <X className="h-5 w-5" />
              </Button>
            </div>
            {newKeyReveal && (
              <>
                <p className="mb-3 text-xs text-violet-200/50 sm:text-sm">Copy this key now. You won&apos;t see it again.</p>
                <div className="flex flex-col gap-3 rounded-xl border border-white/[0.08] bg-[#0a0514]/80 px-3 py-3 font-mono text-xs text-fuchsia-300 sm:flex-row sm:items-center sm:px-4 sm:text-sm">
                  <span className="min-w-0 flex-1 select-text break-all" title={newKeyReveal.key}>
                    {newKeyReveal.key}
                  </span>
                  <Button
                    type="button"
                    variant="secondaryCyan"
                    onClick={copyKeyToClipboard}
                    className="min-h-[44px] w-full shrink-0 gap-2 px-4 py-3 sm:w-auto sm:py-2.5"
                    aria-label="Copy API key"
                  >
                    <Copy className="h-4 w-4" />
                    Copy key
                  </Button>
                </div>
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-amber-400/90 sm:text-xs">
                  <ShieldAlert className="h-3.5 w-3.5 shrink-0" />
                  Use{' '}
                  <code className="rounded bg-white/5 px-1 py-0.5 text-[10px] sm:text-xs">
                    Authorization: Bearer &lt;key&gt;
                  </code>
                </p>
              </>
            )}
          </div>
        </Dialog.Panel>
      </Dialog>
    </Layout>
  );
};
