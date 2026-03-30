export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!text) return false;

  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back below (mobile Safari / permission issues / non-secure context)
  }

  try {
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
    const ok = document.execCommand('copy');

    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
