import { useState } from 'react';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import type { FolderOption } from '../services/Dashboard/DashboardService';
import { shortenUrl } from '../services/Dashboard/DashboardService';
import { getApiErrorMessage } from '../utils/apiError';
import { copyTextToClipboard } from '../utils/clipboard';
import { COPY_FEEDBACK_MS } from '../constants';
import { Button } from './ui';
import { APP_INPUT, APP_LABEL } from './app/appTheme';

export type { FolderOption };

interface UrlFormProps {
  onCreated: () => void;
  folders: FolderOption[];
  /** Hides duplicate heading when embedded in dashboard card */
  compact?: boolean;
}

export const UrlForm = ({ onCreated, folders, compact = false }: UrlFormProps) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [folderId, setFolderId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error('Please enter a destination URL');
      return;
    }
    setLoading(true);
    try {
      const result = await shortenUrl({
        url: trimmed,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined,
        folderId: folderId || undefined
      });
      setShortUrl(result.shortUrl);
      setQrModalOpen(false);
      setUrl('');
      setCustomAlias('');
      setExpiresAt('');
      onCreated();
    } catch (err: unknown) {
      console.error(err);
      toast.error(getApiErrorMessage(err, 'Failed to create short URL. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    const ok = await copyTextToClipboard(shortUrl);
    if (ok) {
      setCopied(true);
      toast.success('Link copied to clipboard');
      setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
    } else {
      toast.error('Copy failed. Tap and hold the link to copy.');
    }
  };

  const downloadQR = () => {
    if (!shortUrl) return;
    const canvas = document.getElementById('urlform-qr') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'smurl-qrcode.png';
    link.click();
  };

  return (
    <div>
      {!compact && (
        <h2 className="mb-5 flex items-center gap-2 text-lg font-bold text-white">
          <span className="h-5 w-1 rounded-full bg-gradient-to-b from-fuchsia-400 to-amber-400" />
          Create Short URL
        </h2>
      )}
      <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
        <div>
          <label htmlFor="urlform-destination" className={APP_LABEL}>
            Destination URL
          </label>
          <input
            id="urlform-destination"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            autoComplete="url"
            className={APP_INPUT}
          />
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="urlform-folder" className={APP_LABEL}>
              Folder
            </label>
            <select
              id="urlform-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className={APP_INPUT}
            >
              <option value="">No folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="urlform-alias" className={APP_LABEL}>
              Custom code
            </label>
            <input
              id="urlform-alias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-link"
              autoComplete="off"
              className={APP_INPUT}
            />
          </div>
        </div>
        <div>
          <label htmlFor="urlform-expires" className={APP_LABEL}>
            Expiration
          </label>
          <input
            id="urlform-expires"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className={APP_INPUT}
          />
        </div>
        <Button type="submit" variant="primaryViolet" disabled={loading} fullWidth>
          {loading ? (
            <>
              <span className="h-3 w-3 animate-spin rounded-full border-2 border-[#0a0514]/30 border-t-[#0a0514]" />
              Creating…
            </>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>
      {shortUrl && (
        <div className="mt-4">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0a0514]/60 p-3 sm:flex-row">
            <span className="flex-1 break-all font-mono text-xs text-fuchsia-300 sm:text-sm">{shortUrl}</span>
            <div className="flex w-full gap-2 sm:w-auto">
              <Button type="button" variant="primaryViolet" onClick={copyToClipboard} className="flex-1 px-3 py-2 text-xs sm:flex-none">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button type="button" variant="secondaryCyan" onClick={() => setQrModalOpen(true)} className="flex-1 px-3 py-2 text-xs sm:flex-none">
                QR
              </Button>
            </div>
          </div>

          <Dialog open={qrModalOpen} onClose={() => setQrModalOpen(false)} className="fixed inset-0 z-50 flex items-center justify-center px-4">
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" aria-hidden />
            <Dialog.Panel className="relative w-full max-w-sm rounded-2xl border border-white/[0.08] bg-[#0c0818] p-6 shadow-xl">
              <Button type="button" variant="ghost" onClick={() => setQrModalOpen(false)} className="absolute right-3 top-3 p-1" aria-label="Close">
                <XMarkIcon className="h-5 w-5" />
              </Button>
              <Dialog.Title className="mb-4 text-lg font-semibold text-white">QR Code</Dialog.Title>
              <div className="flex flex-col items-center gap-4">
                <QRCodeCanvas id="urlform-qr" value={shortUrl} size={200} bgColor="#0a0514" fgColor="#e9d5ff" />
                <Button type="button" variant="primaryViolet" onClick={downloadQR} className="gap-2 px-4 py-2 text-xs">
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      )}
    </div>
  );
};
