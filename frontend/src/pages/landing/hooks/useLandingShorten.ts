import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { shortenPublicUrl } from '../../../services/Landing/LandingService';
import { COPY_FEEDBACK_MS } from '../../../constants';

export function useLandingShorten() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shortenMutation = useMutation({
    mutationFn: (longUrl: string) => shortenPublicUrl(longUrl),
    onSuccess: (result) => {
      setShortUrl(result.shortUrl);
      toast.success('Link shortened!');
    },
    onError: (err) => {
      console.error(err);
      toast.error('Failed to shorten URL. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();
    if (!trimmed) return;
    shortenMutation.mutate(trimmed);
  };

  const copyToClipboard = async () => {
    if (!shortUrl) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shortUrl);
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
        return;
      }
    } catch {
      /* fallback below */
    }
    const textarea = document.createElement('textarea');
    textarea.value = shortUrl;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.left = '-9999px';
    textarea.style.top = '0';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.setSelectionRange(0, shortUrl.length);
    try {
      const ok = document.execCommand('copy');
      if (ok) {
        setCopied(true);
        toast.success('Link copied to clipboard');
        setTimeout(() => setCopied(false), COPY_FEEDBACK_MS);
      } else {
        toast.error('Copy failed. Tap and hold the link to copy.');
      }
    } catch {
      toast.error('Copy failed. Tap and hold the link to copy.');
    }
    document.body.removeChild(textarea);
  };

  const downloadQR = () => {
    if (!shortUrl) return;
    const canvas = document.getElementById('smurl-qr') as HTMLCanvasElement | null;
    if (!canvas) return;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'smurl-qrcode.png';
    link.click();
  };

  return {
    url,
    setUrl,
    shortUrl,
    setShortUrl,
    loading: shortenMutation.isPending,
    copied,
    handleSubmit,
    copyToClipboard,
    downloadQR
  };
}
