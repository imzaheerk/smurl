import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { BASE_URL } from '../services/api';
import type { UrlItem, FolderOption } from '../services/Dashboard/DashboardService';
import { deleteUrl, updateUrl } from '../services/Dashboard/DashboardService';
import { getApiErrorMessage } from '../utils/apiError';
import { copyTextToClipboard } from '../utils/clipboard';
import { ROUTES } from '../constants/routes';
import { Button } from './ui';

interface UrlTableProps {
  data: UrlItem[];
  refetch: () => void;
  folders: FolderOption[];
}

export const UrlTable = ({ data, refetch, folders }: UrlTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<UrlItem | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [urlToEdit, setUrlToEdit] = useState<UrlItem | null>(null);
  const [editOriginalUrl, setEditOriginalUrl] = useState('');
  const [editCustomAlias, setEditCustomAlias] = useState('');
  const [editExpiresAt, setEditExpiresAt] = useState('');
  const [editFolderId, setEditFolderId] = useState<string>('');
  const [savingEdit, setSavingEdit] = useState(false);

  const getStatus = (item: UrlItem) => {
    const now = new Date();
    const expiresAt = item.expiresAt ? new Date(item.expiresAt) : null;
    const activeFrom = item.activeFrom ? new Date(item.activeFrom) : null;
    const activeTo = item.activeTo ? new Date(item.activeTo) : null;

    if (expiresAt && expiresAt.getTime() < now.getTime()) {
      return { label: 'Expired', colorClass: 'bg-red-500/10 text-red-300' };
    }

    if (activeFrom && activeFrom.getTime() > now.getTime()) {
      return { label: 'Scheduled', colorClass: 'bg-amber-500/10 text-amber-300' };
    }

    if (activeTo && activeTo.getTime() < now.getTime()) {
      return { label: 'Inactive', colorClass: 'bg-slate-600/40 text-slate-200' };
    }

    if (expiresAt) {
      const diffMs = expiresAt.getTime() - now.getTime();
      const oneDayMs = 24 * 60 * 60 * 1000;
      if (diffMs > 0 && diffMs <= oneDayMs) {
        return { label: 'Expires soon', colorClass: 'bg-amber-500/10 text-amber-300' };
      }
      return { label: 'Active', colorClass: 'bg-emerald-500/10 text-emerald-300' };
    }

    return { label: 'Active', colorClass: 'bg-emerald-500/10 text-emerald-300' };
  };

  const openDeleteModal = (item: UrlItem) => {
    setUrlToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUrlToDelete(null);
    setDeleteModalOpen(false);
  };

  const openEditModal = (item: UrlItem) => {
    setUrlToEdit(item);
    setEditOriginalUrl(item.originalUrl);
    setEditCustomAlias(item.shortCode);
    setEditExpiresAt('');
    setEditFolderId(item.folderId ?? '');
    setEditModalOpen(true);
  };

  const closeEditModal = () => {
    setUrlToEdit(null);
    setEditModalOpen(false);
  };

  const performDelete = async () => {
    if (!urlToDelete) return;
    setDeletingId(urlToDelete.id);
    closeDeleteModal();
    try {
      await deleteUrl(urlToDelete.id);
      refetch();
      toast.success('URL deleted successfully!');
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to delete URL'));
    } finally {
      setDeletingId(null);
    }
  };

  const copyShort = async (shortUrl: string) => {
    const ok = await copyTextToClipboard(shortUrl);
    if (ok) toast.success('Link copied to clipboard');
    else toast.error('Copy failed. Tap and hold the link to copy.');
  };

  const shareShort = async (shortUrl: string) => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Short link',
          text: shortUrl,
          url: shortUrl,
        });
        toast.success('Link shared');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await copyShort(shortUrl);
        }
      }
    } else {
      await copyShort(shortUrl);
    }
  };

  const performEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlToEdit) return;
    const trimmedUrl = editOriginalUrl.trim();
    if (!trimmedUrl) {
      toast.error('Please enter a destination URL');
      return;
    }
    setSavingEdit(true);
    try {
      await updateUrl(urlToEdit.id, {
        originalUrl: trimmedUrl,
        customAlias: editCustomAlias.trim() || null,
        expiresAt: editExpiresAt || null,
        folderId: editFolderId || null
      });
      closeEditModal();
      refetch();
      toast.success('URL updated successfully!');
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to update URL'));
    } finally {
      setSavingEdit(false);
    }
  };

  return (
    <div>
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="w-1 h-6 rounded-full bg-gradient-to-b from-fuchsia-400 to-cyan-500" />
          Your URLs
        </h2>
      </div>
      {/* Mobile: card list (no horizontal scroll) */}
      <div className="md:hidden space-y-3 px-4 pb-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="font-medium">No URLs yet</p>
            <p className="text-sm mt-1">Create your first short link above.</p>
          </div>
        ) : (
          data.map((item) => {
            const shortUrl = `${BASE_URL}/${item.shortCode}`;
            return (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-xs break-all hover:underline flex-1 min-w-0"
                    >
                      {shortUrl}
                    </a>
                    <div className="flex shrink-0 gap-1">
                      <Button type="button" variant="secondaryCyan" onClick={() => copyShort(shortUrl)} className="shrink-0 px-2.5 py-1 text-[11px]">
                        Copy
                      </Button>
                      <Button type="button" variant="ghost" onClick={() => shareShort(shortUrl)} className="shrink-0 p-1.5" aria-label="Share">
                        <Share2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                  <span
                    className={`self-start inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${getStatus(
                      item
                    ).colorClass}`}
                  >
                    {getStatus(item).label}
                  </span>
                </div>
                <p className="text-slate-400 text-xs break-all line-clamp-2" title={item.originalUrl}>
                  {item.originalUrl}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-white/5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 text-xs font-semibold tabular-nums">
                    {item.clickCount} clicks
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex gap-2 pt-1">
                  <Link
                    to={ROUTES.ANALYTICS(item.id)}
                    className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20"
                  >
                    Analytics
                  </Link>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => openDeleteModal(item)}
                    disabled={deletingId === item.id}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:!bg-red-500/20 hover:!text-red-300 disabled:opacity-50 min-h-[36px]"
                  >
                      {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </Button>
                  <Button
                    type="button"
                    variant="secondaryCyan"
                    onClick={() => openEditModal(item)}
                    className="flex-1 py-2 text-xs font-semibold rounded-lg"
                  >
                    Edit
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop: grid cards (no horizontal scroll) */}
      <div className="hidden md:block px-4 pb-4">
        {data.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="font-medium">No URLs yet</p>
            <p className="text-sm mt-1">Create your first short link above.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {data.map((item) => {
              const shortUrl = `${BASE_URL}/${item.shortCode}`;
              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4 flex flex-col gap-3 hover:border-cyan-500/40 hover:bg-white/[0.04] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 hover:text-cyan-300 font-mono text-xs break-all hover:underline flex-1 min-w-0"
                    >
                      {shortUrl}
                    </a>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold ${getStatus(
                        item
                      ).colorClass}`}
                    >
                      {getStatus(item).label}
                    </span>
                  </div>
                  <p
                    className="text-slate-400 text-xs break-all line-clamp-2"
                    title={item.originalUrl}
                  >
                    {item.originalUrl}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-semibold tabular-nums">
                      {item.clickCount} clicks
                    </span>
                    <span className="text-slate-500">
                      {new Date(item.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Link
                      to={ROUTES.ANALYTICS(item.id)}
                      className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20"
                    >
                      Analytics
                    </Link>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => openDeleteModal(item)}
                      disabled={deletingId === item.id}
                      className="flex-1 py-2 text-xs font-semibold rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 hover:!bg-red-500/20 hover:!text-red-300 disabled:opacity-50 min-h-[36px]"
                    >
                      {deletingId === item.id ? 'Deleting…' : 'Delete'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondaryCyan"
                      onClick={() => openEditModal(item)}
                      className="flex-1 py-2 text-xs font-semibold rounded-lg"
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* delete confirmation modal */}
      <Dialog
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <Dialog.Panel className="relative max-w-md w-full bg-slate-900 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-400" />
            <Dialog.Title className="text-lg font-semibold text-white">
              Delete URL
            </Dialog.Title>
          </div>
          <Dialog.Description className="mt-2 text-sm text-slate-300">
            This action cannot be undone. Are you sure you want to delete the
            following URL?
          </Dialog.Description>
          {urlToDelete && (
            <div className="mt-4 bg-slate-800/60 rounded-lg p-3">
              <p className="text-xs text-slate-400">Short:</p>
              <a
                href={`${BASE_URL}/${urlToDelete.shortCode}`}
                target="_blank"
                rel="noreferrer"
                className="text-cyan-400 hover:underline text-sm block truncate"
              >
                {BASE_URL}/{urlToDelete.shortCode}
              </a>
              <p className="mt-2 text-xs text-slate-400">Original:</p>
              <p className="text-sm text-slate-200 truncate">
                {urlToDelete.originalUrl}
              </p>
            </div>
          )}
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondaryGray" onClick={closeDeleteModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={performDelete}>
              Delete URL
            </Button>
          </div>
        </Dialog.Panel>
      </Dialog>

      {/* edit modal */}
      <Dialog
        open={editModalOpen}
        onClose={closeEditModal}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <Dialog.Panel className="relative max-w-lg w-full bg-slate-900 rounded-2xl p-6 shadow-xl">
          <Dialog.Title className="text-lg font-semibold text-white mb-1">
            Edit URL
          </Dialog.Title>
          <Dialog.Description className="text-sm text-slate-300 mb-4">
            Update the destination, short code, expiration, or folder for this link.
          </Dialog.Description>
          <form onSubmit={performEdit} className="space-y-4">
            <div>
              <label
                htmlFor="edit-original-url"
                className="block text-sm font-semibold text-slate-400 mb-1.5"
              >
                Destination URL
              </label>
              <input
                id="edit-original-url"
                type="url"
                required
                value={editOriginalUrl}
                onChange={(e) => setEditOriginalUrl(e.target.value)}
                className="w-full rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="edit-custom-alias"
                  className="block text-sm font-semibold text-slate-400 mb-1.5"
                >
                  Custom short code
                </label>
                <input
                  id="edit-custom-alias"
                  type="text"
                  value={editCustomAlias}
                  onChange={(e) => setEditCustomAlias(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                />
              </div>
              <div>
                <label
                  htmlFor="edit-expires-at"
                  className="block text-sm font-semibold text-slate-400 mb-1.5"
                >
                  Expiration
                </label>
                <input
                  id="edit-expires-at"
                  type="datetime-local"
                  value={editExpiresAt}
                  onChange={(e) => setEditExpiresAt(e.target.value)}
                  className="w-full rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="edit-folder"
                className="block text-sm font-semibold text-slate-400 mb-1.5"
              >
                Folder
              </label>
              <select
                id="edit-folder"
                value={editFolderId}
                onChange={(e) => setEditFolderId(e.target.value)}
                className="w-full rounded-lg bg-slate-950/80 border border-white/10 px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50"
              >
                <option value="">No folder</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-4 flex justify-end gap-3">
              <Button type="button" variant="secondaryGray" onClick={closeEditModal}>
                Cancel
              </Button>
              <Button type="submit" variant="primaryCyan" disabled={savingEdit}>
                {savingEdit ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};
