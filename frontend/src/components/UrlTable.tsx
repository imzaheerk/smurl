import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api, { BASE_URL } from '../services/api';

interface UrlItem {
  id: string;
  shortCode: string;
  originalUrl: string;
  clickCount: number;
  createdAt: string;
  folderId?: string | null;
  folder?: { id: string; name: string } | null;
}

interface Props {
  data: UrlItem[];
  refetch: () => void;
}

export const UrlTable = ({ data, refetch }: Props) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState<UrlItem | null>(null);

  const openDeleteModal = (item: UrlItem) => {
    setUrlToDelete(item);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setUrlToDelete(null);
    setDeleteModalOpen(false);
  };

  const performDelete = async () => {
    if (!urlToDelete) return;
    setDeletingId(urlToDelete.id);
    closeDeleteModal();
    try {
      await api.delete(`/url/${urlToDelete.id}`);
      refetch();
      toast.success('URL deleted successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  const copyShort = async (shortUrl: string) => {
    await navigator.clipboard.writeText(shortUrl);
    toast.success('Link copied to clipboard');
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
                    <button
                      type="button"
                      onClick={() => copyShort(shortUrl)}
                      className="px-2 py-1.5 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200"
                    >
                      Copy
                    </button>
                    <button
                      type="button"
                      onClick={() => shareShort(shortUrl)}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10"
                      aria-label="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
                    to={`/analytics/${item.id}`}
                    className="flex-1 text-center py-2 rounded-lg text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20"
                  >
                    Analytics
                  </Link>
                  <button
                    onClick={() => openDeleteModal(item)}
                    disabled={deletingId === item.id}
                    className="flex-1 py-2 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {deletingId === item.id ? 'Deleting…' : 'Delete'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/[0.02]">
              <th scope="col" className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Short URL</th>
              <th scope="col" className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Original</th>
              <th scope="col" className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Clicks</th>
              <th scope="col" className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-400">Created</th>
              <th scope="col" className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => {
              const shortUrl = `${BASE_URL}/${item.shortCode}`;
              return (
                <tr
                  key={item.id}
                  className="border-b border-white/5 hover:bg-white/[0.03] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <a
                        href={shortUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-cyan-400 hover:text-cyan-300 font-mono text-xs truncate max-w-[180px] hover:underline"
                      >
                        {shortUrl}
                      </a>
                      <button
                        type="button"
                        onClick={() => copyShort(shortUrl)}
                        className="shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-all"
                      >
                        Copy
                      </button>
                      <button
                        type="button"
                        onClick={() => shareShort(shortUrl)}
                        className="shrink-0 p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:bg-white/10 hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 transition-all"
                        title="Share short link"
                        aria-label="Share short link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-5 py-4 max-w-xs">
                    <span className="block truncate text-slate-400" title={item.originalUrl}>
                      {item.originalUrl}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg bg-cyan-500/10 text-cyan-300 font-semibold tabular-nums">
                      {item.clickCount}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 text-xs">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        to={`/analytics/${item.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 hover:bg-fuchsia-500/20 transition-all"
                      >
                        Analytics
                      </Link>
                      <button
                        onClick={() => openDeleteModal(item)}
                        disabled={deletingId === item.id}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 disabled:opacity-50 transition-all"
                      >
                        {deletingId === item.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-5 py-16 text-center text-slate-500"
                >
                  <p className="font-medium">No URLs yet</p>
                  <p className="text-sm mt-1">Create your first short link above.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* confirmation modal */}
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
            <button
              onClick={closeDeleteModal}
              className="px-4 py-2 rounded-lg bg-slate-700 text-sm font-medium text-slate-200 hover:bg-slate-600 transition"
            >
              Cancel
            </button>
            <button
              onClick={performDelete}
              className="px-4 py-2 rounded-lg bg-red-600 text-sm font-medium text-white hover:bg-red-500 transition"
            >
              Delete URL
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};
