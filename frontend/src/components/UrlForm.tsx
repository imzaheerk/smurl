import { useState } from 'react';
import toast from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';
import { ArrowDownTrayIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import api from '../services/api';

interface Props {
  onCreated: () => void;
}

export const UrlForm = ({ onCreated }: Props) => {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/url/shorten', {
        url,
        customAlias: customAlias || undefined,
        expiresAt: expiresAt || undefined
      });
      setShortUrl(res.data.shortUrl);
      setQrModalOpen(false);
      setUrl('');
      setCustomAlias('');
      setExpiresAt('');
      onCreated();
    } catch (err) {
      console.error(err);
      alert('Failed to create short URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    await navigator.clipboard.writeText(shortUrl);
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
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold text-slate-400 mb-2">Destination URL</label>
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/very-long-url"
            className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Custom short code (optional)</label>
            <input
              type="text"
              value={customAlias}
              onChange={(e) => setCustomAlias(e.target.value)}
              placeholder="my-custom-link"
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-2">Expiration (optional)</label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full rounded-xl bg-slate-950/80 border border-white/10 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 hover:from-cyan-400 hover:to-teal-400 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
        >
          {loading ? (
            <>
              <span className="h-3 w-3 rounded-full border-2 border-slate-950/30 border-t-slate-950 animate-spin" />
              Creating...
            </>
          ) : (
            'Shorten URL'
          )}
        </button>
      </form>
      {shortUrl && (
        <div className="mt-6">
          <div className="flex flex-col md:flex-row items-center gap-4 bg-slate-950/80 border border-white/10 rounded-xl p-4">
            <span className="break-all flex-1 text-sm text-cyan-300 font-mono">{shortUrl}</span>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-semibold hover:from-cyan-400 hover:to-teal-400 transition"
              >
                Copy
              </button>
              <button
                onClick={openQRModal}
                className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-xs font-semibold hover:bg-slate-600 transition"
              >
                Show QR
              </button>
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
              <button
                onClick={closeQRModal}
                className="absolute top-3 right-3 text-slate-400 hover:text-slate-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
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
                <button
                  onClick={downloadQR}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 text-slate-950 text-xs font-semibold hover:from-cyan-400 hover:to-teal-400 transition"
                >
                  <ArrowDownTrayIcon className="h-4 w-4" />
                  Download
                </button>
              </div>
            </Dialog.Panel>
          </Dialog>
        </div>
      )}
    </div>
  );
};
