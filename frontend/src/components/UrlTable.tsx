import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Dialog } from '@headlessui/react';
import {
  AlertTriangle,
  BarChart3,
  Copy,
  ExternalLink,
  FolderOpen,
  Link2,
  Pencil,
  Share2,
  Trash2,
  X
} from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { BASE_URL } from '../services/api';
import type { UrlItem, FolderOption } from '../services/Dashboard/DashboardService';
import { deleteUrl, updateUrl } from '../services/Dashboard/DashboardService';
import { getApiErrorMessage } from '../utils/apiError';
import { copyTextToClipboard } from '../utils/clipboard';
import { ROUTES } from '../constants/routes';
import { LANDING_SECTION_LABEL } from './app/appTheme';
import { Button } from './ui';
import { EditUrlModal } from './EditUrlModal';

interface UrlTableProps {
  data: UrlItem[];
  refetch: () => void;
  folders: FolderOption[];
}

type StatusInfo = { label: string; className: string };

const ACTION_BASE =
  'inline-flex min-h-[48px] min-w-0 flex-1 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl border px-1.5 py-2 text-[10px] font-semibold leading-none transition touch-manipulation sm:min-h-[40px] sm:flex-row sm:gap-1.5 sm:px-2.5 sm:py-2 sm:text-xs';

function getStatus(item: UrlItem): StatusInfo {
  const now = new Date();
  const expiresAt = item.expiresAt ? new Date(item.expiresAt) : null;
  const activeFrom = item.activeFrom ? new Date(item.activeFrom) : null;
  const activeTo = item.activeTo ? new Date(item.activeTo) : null;

  const badge = (label: string, className: string) => ({ label, className });

  if (expiresAt && expiresAt.getTime() < now.getTime()) {
    return badge('Expired', 'border-red-500/25 bg-red-500/10 text-red-300');
  }
  if (activeFrom && activeFrom.getTime() > now.getTime()) {
    return badge('Scheduled', 'border-amber-500/25 bg-amber-500/10 text-amber-300');
  }
  if (activeTo && activeTo.getTime() < now.getTime()) {
    return badge('Inactive', 'border-white/[0.08] bg-white/[0.04] text-violet-300/60');
  }
  if (expiresAt) {
    const diffMs = expiresAt.getTime() - now.getTime();
    if (diffMs > 0 && diffMs <= 24 * 60 * 60 * 1000) {
      return badge('Expires soon', 'border-amber-500/25 bg-amber-500/10 text-amber-300');
    }
    return badge('Active', 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300');
  }
  return badge('Active', 'border-emerald-500/25 bg-emerald-500/10 text-emerald-300');
}

function UrlLinkCard({
  item,
  deleting,
  onCopy,
  onShare,
  onEdit,
  onDelete
}: {
  item: UrlItem;
  deleting: boolean;
  onCopy: (url: string) => void;
  onShare: (url: string) => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const shortUrl = `${BASE_URL}/${item.shortCode}`;
  const status = getStatus(item);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#0c0818]/80 to-[#0a0514]/90 p-4 shadow-[0_8px_32px_rgba(0,0,0,0.25)] transition hover:border-fuchsia-500/25 hover:shadow-[0_12px_40px_rgba(232,121,249,0.08)] sm:p-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500/0 via-fuchsia-500/40 to-amber-400/0 opacity-0 transition group-hover:opacity-100"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-fuchsia-500/5 blur-2xl transition group-hover:bg-fuchsia-500/10"
        aria-hidden
      />

      <div className="relative mb-3 flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <span
            className={
              'inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ' +
              status.className
            }
          >
            {status.label}
          </span>
          {item.folder?.name && (
            <span className="inline-flex max-w-[120px] items-center gap-1 truncate rounded-full border border-amber-500/20 bg-amber-500/10 px-2 py-0.5 text-[10px] font-medium text-amber-200/90">
              <FolderOpen className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
              <span className="truncate">{item.folder.name}</span>
            </span>
          )}
        </div>
        <time className="shrink-0 text-[11px] text-violet-400/45" dateTime={item.createdAt}>
          {new Date(item.createdAt).toLocaleDateString()}
        </time>
      </div>

      <a
        href={shortUrl}
        target="_blank"
        rel="noreferrer"
        className="relative block break-all text-sm font-semibold leading-snug text-violet-100/95 hover:text-white"
      >
        {BASE_URL}/
        <span className="bg-gradient-to-r from-fuchsia-300 to-pink-300 bg-clip-text text-transparent">
          {item.shortCode}
        </span>
      </a>

      <p
        className="relative mt-2 line-clamp-2 break-all text-xs leading-relaxed text-violet-200/45"
        title={item.originalUrl}
      >
        {item.originalUrl}
      </p>

      <div className="relative mt-4 flex items-center justify-between gap-2 border-t border-white/[0.06] pt-3">
        <div className="inline-flex items-center gap-2 rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/10 px-3 py-1.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-500/15">
            <BarChart3 className="h-3.5 w-3.5 text-fuchsia-300" aria-hidden />
          </span>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wide text-violet-400/50">Clicks</p>
            <p className="text-sm font-bold tabular-nums text-fuchsia-100">{item.clickCount}</p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onCopy(shortUrl)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-violet-200/70 transition hover:border-fuchsia-500/25 hover:text-fuchsia-200 max-sm:h-11 max-sm:w-11"
            aria-label="Copy short link"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onShare(shortUrl)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-violet-200/70 transition hover:border-fuchsia-500/25 hover:text-fuchsia-200 max-sm:h-11 max-sm:w-11"
            aria-label="Share short link"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-violet-200/70 transition hover:border-fuchsia-500/25 hover:text-fuchsia-200 max-sm:h-11 max-sm:w-11"
            aria-label="Open short link"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        <Link
          to={ROUTES.ANALYTICS(item.id)}
          aria-label="View analytics"
          className={
            ACTION_BASE +
            ' border-fuchsia-500/25 bg-fuchsia-500/10 text-fuchsia-200 hover:bg-fuchsia-500/15'
          }
        >
          <BarChart3 className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
          <span className="truncate sm:max-w-none">Stats</span>
        </Link>
        <button
          type="button"
          onClick={onEdit}
          aria-label="Edit link"
          className={
            ACTION_BASE +
            ' border-white/[0.08] bg-white/[0.03] text-violet-200/80 hover:border-fuchsia-500/25 hover:text-fuchsia-200'
          }
        >
          <Pencil className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
          <span className="truncate">Edit</span>
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label="Delete link"
          className={
            ACTION_BASE +
            ' border-red-500/20 bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:text-red-300 disabled:opacity-50'
          }
        >
          <Trash2 className="h-4 w-4 shrink-0 sm:h-3.5 sm:w-3.5" aria-hidden />
          <span className="truncate">{deleting ? '…' : 'Delete'}</span>
        </button>
      </div>
    </article>
  );
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
        await navigator.share({ title: 'Short link', text: shortUrl, url: shortUrl });
        toast.success('Link shared');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') await copyShort(shortUrl);
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

  if (data.length === 0) {
    return (
      <div className="px-4 py-16 text-center sm:px-6">
        <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
          <div className="absolute inset-0 rounded-2xl bg-fuchsia-500/20 blur-xl" aria-hidden />
          <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-fuchsia-500/25 bg-fuchsia-500/10">
            <Link2 className="h-6 w-6 text-fuchsia-300" aria-hidden />
          </div>
        </div>
        <p className="text-sm font-semibold text-violet-100/80">No links match your filters</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs leading-relaxed text-violet-400/45">
          Try adjusting search or filters, or create a new short link from the panel on the left.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-3 p-4 sm:gap-4 sm:p-5 md:grid-cols-2 xl:grid-cols-3">
        {data.map((item) => (
          <UrlLinkCard
            key={item.id}
            item={item}
            deleting={deletingId === item.id}
            onCopy={copyShort}
            onShare={shareShort}
            onEdit={() => openEditModal(item)}
            onDelete={() => openDeleteModal(item)}
          />
        ))}
      </div>

      <Dialog
        open={deleteModalOpen}
        onClose={closeDeleteModal}
        className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      >
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

        <Dialog.Panel
          as={motion.div}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
          className="relative w-full max-w-md overflow-hidden rounded-t-2xl border border-white/[0.08] border-b-0 bg-[#0c0818] shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:rounded-2xl sm:border-b"
        >
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-red-500/[0.05] via-transparent to-fuchsia-500/[0.04]"
            aria-hidden
          />

          <div className="relative p-5 sm:p-6">
            <Button
              type="button"
              variant="ghost"
              onClick={closeDeleteModal}
              className="absolute right-3 top-3 p-1.5 max-sm:flex max-sm:h-11 max-sm:w-11 max-sm:items-center max-sm:justify-center"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </Button>

            <div className="flex flex-col items-center text-center sm:items-start sm:pr-10 sm:text-left">
              <div className="relative">
                <div className="absolute inset-0 rounded-2xl bg-red-500/20 blur-xl" aria-hidden />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/25 bg-red-500/10">
                  <AlertTriangle className="h-5 w-5 text-red-400" aria-hidden />
                </div>
              </div>
              <p className={'mt-4 ' + LANDING_SECTION_LABEL}>Delete</p>
              <Dialog.Title className="mt-1 text-lg font-semibold text-white">Remove this link?</Dialog.Title>
              <Dialog.Description className="mt-2 text-sm text-violet-200/55">
                This cannot be undone. The short link will stop working immediately.
              </Dialog.Description>
            </div>

            {urlToDelete && (
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0a0514]/80 px-3.5 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400/50">Short link</p>
                <p className="mt-1 break-all text-sm text-fuchsia-300">
                  {BASE_URL}/{urlToDelete.shortCode}
                </p>
                <p className="mt-2 truncate text-xs text-violet-200/45" title={urlToDelete.originalUrl}>
                  {urlToDelete.originalUrl}
                </p>
              </div>
            )}

            <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="secondaryCyan"
                onClick={closeDeleteModal}
                className="min-h-[44px] w-full rounded-xl px-5 sm:w-auto"
              >
                Keep link
              </Button>
              <Button
                type="button"
                variant="danger"
                onClick={performDelete}
                className="min-h-[44px] w-full gap-2 rounded-xl px-5 hover:scale-100 sm:w-auto"
              >
                <Trash2 className="h-4 w-4 shrink-0" aria-hidden />
                Delete URL
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>

      <EditUrlModal
        open={editModalOpen}
        onClose={closeEditModal}
        urlToEdit={urlToEdit}
        originalUrl={editOriginalUrl}
        setOriginalUrl={setEditOriginalUrl}
        customAlias={editCustomAlias}
        setCustomAlias={setEditCustomAlias}
        expiresAt={editExpiresAt}
        setExpiresAt={setEditExpiresAt}
        folderId={editFolderId}
        setFolderId={setEditFolderId}
        folders={folders}
        saving={savingEdit}
        onSubmit={performEdit}
      />
    </>
  );
};
