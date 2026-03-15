import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { CustomDomainRow, ApiKeyRow, CreateApiKeyResult } from '../../../services/Settings/SettingsService';
import { getApiErrorMessage } from '../../../utils/apiError';
import {
  getCustomDomains,
  getApiKeys,
  addCustomDomain,
  deleteCustomDomain,
  createApiKey,
  revokeApiKey,
  getEmailFromToken
} from '../../../services/Settings/SettingsService';

const settingsKeys = {
  domains: ['settings', 'domains'] as const,
  apiKeys: ['settings', 'apiKeys'] as const
};

export function useSettings(token: string | null) {
  const queryClient = useQueryClient();
  const email = getEmailFromToken(token);
  const [newDomain, setNewDomain] = useState('');
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyReveal, setNewKeyReveal] = useState<{ key: string; name: string } | null>(null);
  const [revokeConfirm, setRevokeConfirm] = useState<string | null>(null);

  const domainsQuery = useQuery({
    queryKey: settingsKeys.domains,
    queryFn: getCustomDomains
  });

  const apiKeysQuery = useQuery({
    queryKey: settingsKeys.apiKeys,
    queryFn: getApiKeys
  });

  useEffect(() => {
    if (domainsQuery.isError) toast.error('Failed to load custom domains');
  }, [domainsQuery.isError]);
  useEffect(() => {
    if (apiKeysQuery.isError) toast.error('Failed to load API keys');
  }, [apiKeysQuery.isError]);

  const addDomainMutation = useMutation({
    mutationFn: (domain: string) => addCustomDomain(domain),
    onSuccess: (_, domain) => {
      toast.success(`Added ${domain}`);
      setNewDomain('');
      void queryClient.invalidateQueries({ queryKey: settingsKeys.domains });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to add domain'));
    }
  });

  const deleteDomainMutation = useMutation({
    mutationFn: (id: string) => deleteCustomDomain(id),
    onSuccess: () => {
      toast.success('Domain removed');
      void queryClient.invalidateQueries({ queryKey: settingsKeys.domains });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to remove domain'));
    }
  });

  const createKeyMutation = useMutation({
    mutationFn: (name: string) => createApiKey(name),
    onSuccess: (result: CreateApiKeyResult) => {
      setNewKeyReveal({ key: result.key, name: result.name });
      setNewKeyName('');
      void queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to create API key'));
    }
  });

  const revokeKeyMutation = useMutation({
    mutationFn: (id: string) => revokeApiKey(id),
    onSuccess: () => {
      setRevokeConfirm(null);
      toast.success('API key revoked');
      void queryClient.invalidateQueries({ queryKey: settingsKeys.apiKeys });
    },
    onError: (err: unknown) => {
      toast.error(getApiErrorMessage(err, 'Failed to revoke key'));
    }
  });

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const domain = newDomain.trim();
    if (!domain) return;
    addDomainMutation.mutate(domain);
  };

  const handleDeleteDomain = (id: string) => {
    deleteDomainMutation.mutate(id);
  };

  const handleCreateKey = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newKeyName.trim();
    if (!name) return;
    createKeyMutation.mutate(name);
  };

  const handleRevokeKey = (id: string) => {
    revokeKeyMutation.mutate(id);
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

  return {
    email,
    domains: domainsQuery.data ?? [],
    loading: domainsQuery.isLoading,
    newDomain,
    setNewDomain,
    adding: addDomainMutation.isPending,
    apiKeys: apiKeysQuery.data ?? [],
    apiKeysLoading: apiKeysQuery.isLoading,
    newKeyName,
    setNewKeyName,
    creatingKey: createKeyMutation.isPending,
    newKeyReveal,
    setNewKeyReveal,
    revokeConfirm,
    setRevokeConfirm,
    handleAddDomain,
    handleDeleteDomain,
    handleCreateKey,
    handleRevokeKey,
    copyKeyToClipboard
  };
}
