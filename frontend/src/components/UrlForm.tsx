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

export type { FolderOption };

interface UrlFormProps {
  onCreated: () => void;
  folders: FolderOption[];
}

export const UrlForm = ({ onCreated, folders }: UrlFormProps) => {
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

  const openQRModal = () => {
    if (!shortUrl) return;
    setQrModalOpen(true);
  };

  const closeQRModal = () => setQrModalOpen(false);

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="w-1 h-6 rounded-full bg-gradient-to-b from-cyan-400 to-fuchsia-500" />
        Create Short URL
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label htmlFor="urlform-destination" className="block text-sm font-semibold text-slate-400 mb-2">Destination URL</label>
          <input
            id="urlform-destination"
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            autoComplete="url"
            className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <label htmlFor="urlform-folder" className="block text-sm font-semibold text-slate-400 mb-2">Folder (optional)</label>
            <select
              id="urlform-folder"
              value={folderId}
              onChange={(e) => setFolderId(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            >
              <option value="">No folder</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>{f.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="urlform-alias" className="block text-sm font-semibold text-slate-400 mb-2">Custom short code (optional)</label>
            <input
              id="urlform-alias"
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-link"
              autoComplete="off"
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label htmlFor="urlform-expires" className="block text-sm font-semibold text-slate-400 mb-2">Expiration (optional)</label>
            <input
              id="urlform-expires"
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
        <Button type="submit" variant="primaryViolet" disabled={loading}>
          {loading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
              Creating...
            </>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>
      {shortUrl && (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-950/80 border border-white/10 rounded-xl p-4">
            <span className="break-all flex-1 text-sm text-cyan-300 font-mono">{shortUrl}</span>
            <div className="flex gap-2">
              <Button type="button" variant="primaryCyan" onClick={copyToClipboard} aria-label={copied ? 'Copied' : 'Copy link'} className="px-4 py-2 text-xs">
                {copied ? 'Copied!' : 'Copy'}
              </Button>
              <Button type="button" variant="secondaryGray" onClick={openQRModal} className="px-4 py-2 text-xs">
                Show QR
              </Button>
            </div>
          </div>

          {/* QR modal */}
          <Dialog
            open={qrModalOpen}
            onClose={closeQRModal}
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
          >
            <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
            <Dialog.Panel className="relative max-w-sm w-full bg-slate-900 rounded-2xl p-6 shadow-xl">
              <Button
                type="button"
                variant="ghost"
                onClick={closeQRModal}
                className="absolute top-3 right-3 p-1"
                aria-label="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </Button>
              <Dialog.Title className="text-lg font-semibold text-white mb-4">
                QR Code
              </Dialog.Title>
              <div className="flex flex-col items-center gap-4">
                <QRCodeCanvas
                  id="urlform-qr"
                  value={shortUrl}
                  size={200}
                  bgColor="#020617"
                  fgColor="#e5e7eb"
                />
                <Button type="button" variant="primaryCyan" onClick={downloadQR} className="px-4 py-2 text-xs">
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
