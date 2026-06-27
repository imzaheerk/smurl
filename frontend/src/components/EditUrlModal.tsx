import { Dialog } from '@headlessui/react';
import { Pencil, X } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FolderOption, UrlItem } from '../services/Dashboard/DashboardService';
import { BASE_URL } from '../services/api';
import { APP_INPUT, APP_LABEL } from './app/appTheme';
import { Button } from './ui';

const MOBILE_INPUT = APP_INPUT + ' max-sm:min-h-[44px] max-sm:text-base';

export interface EditUrlModalProps {
  open: boolean;
  onClose: () => void;
  urlToEdit: UrlItem | null;
  originalUrl: string;
  setOriginalUrl: (value: string) => void;
  customAlias: string;
  setCustomAlias: (value: string) => void;
  expiresAt: string;
  setExpiresAt: (value: string) => void;
  folderId: string;
  setFolderId: (value: string) => void;
  folders: FolderOption[];
  saving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function EditUrlModal({
  open,
  onClose,
  urlToEdit,
  originalUrl,
  setOriginalUrl,
  customAlias,
  setCustomAlias,
  expiresAt,
  setExpiresAt,
  folderId,
  setFolderId,
  folders,
  saving,
  onSubmit
}: EditUrlModalProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
    >
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />

      <Dialog.Panel
        as={motion.div}
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.98 }}
        transition={{ duration: 0.22, ease: [0.4, 0, 0.2, 1] }}
        className="relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-t-2xl border border-fuchsia-500/20 border-b-0 bg-[#0c0818] shadow-2xl sm:max-h-[min(90vh,640px)] sm:max-w-lg sm:rounded-2xl sm:border-b"
      >
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-fuchsia-500 via-pink-500 to-amber-400"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent"
          aria-hidden
        />

        <div className="relative shrink-0 border-b border-white/[0.06] p-5 sm:p-6">
          <Dialog.Title className="flex items-center gap-2.5 pr-10 text-base font-semibold text-white sm:text-lg">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-fuchsia-500/30 bg-fuchsia-500/10">
              <Pencil className="h-4 w-4 text-fuchsia-400" aria-hidden />
            </span>
            Edit URL
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-xs text-violet-200/50 sm:text-sm">
            Update the destination, short code, expiration, or folder for this link.
          </Dialog.Description>
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="absolute right-3 top-3 p-1.5 sm:right-4 sm:top-4 max-sm:flex max-sm:h-11 max-sm:w-11 max-sm:items-center max-sm:justify-center"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={onSubmit} className="relative flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain p-5 sm:p-6">
            {urlToEdit && (
              <div className="mb-4 rounded-xl border border-white/[0.08] bg-[#0a0514]/80 px-3.5 py-3 sm:mb-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-violet-400/50">
                  Short link
                </p>
                <a
                  href={`${BASE_URL}/${urlToEdit.shortCode}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 block break-all text-sm text-fuchsia-300 hover:text-fuchsia-200"
                >
                  {BASE_URL}/{urlToEdit.shortCode}
                </a>
              </div>
            )}

            <div className="space-y-3.5">
              <div>
                <label htmlFor="edit-original-url" className={APP_LABEL}>
                  Destination URL
                </label>
                <input
                  id="edit-original-url"
                  type="url"
                  required
                  value={originalUrl}
                  onChange={(e) => setOriginalUrl(e.target.value)}
                  placeholder="https://example.com/page"
                  className={MOBILE_INPUT}
                  autoComplete="url"
                />
              </div>

              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                <div>
                  <label htmlFor="edit-custom-alias" className={APP_LABEL}>
                    Custom short code
                  </label>
                  <input
                    id="edit-custom-alias"
                    type="text"
                    value={customAlias}
                    onChange={(e) => setCustomAlias(e.target.value)}
                    placeholder="my-campaign"
                    className={MOBILE_INPUT}
                    spellCheck={false}
                  />
                </div>
                <div>
                  <label htmlFor="edit-expires-at" className={APP_LABEL}>
                    Expiration
                  </label>
                  <input
                    id="edit-expires-at"
                    type="datetime-local"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className={MOBILE_INPUT + ' min-w-0 [color-scheme:dark]'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-folder" className={APP_LABEL}>
                  Folder
                </label>
                <select
                  id="edit-folder"
                  value={folderId}
                  onChange={(e) => setFolderId(e.target.value)}
                  className={MOBILE_INPUT + ' cursor-pointer'}
                >
                  <option value="">No folder</option>
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="relative shrink-0 border-t border-white/[0.06] bg-[#0c0818]/95 p-5 backdrop-blur-sm max-sm:pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] sm:p-6 sm:pt-5">
            <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end sm:gap-3">
              <Button
                type="button"
                variant="secondaryCyan"
                onClick={onClose}
                className="min-h-[44px] w-full rounded-xl px-5 sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primaryViolet"
                disabled={saving}
                className="min-h-[44px] w-full rounded-xl px-5 sm:w-auto"
              >
                {saving ? 'Saving…' : 'Save changes'}
              </Button>
            </div>
          </div>
        </form>
      </Dialog.Panel>
    </Dialog>
  );
}
