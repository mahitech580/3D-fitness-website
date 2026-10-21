import { useState } from 'react';

export function ShareSiteButton() {
  const [status, setStatus] = useState('');

  async function shareSite() {
    const shareData = {
      title: 'Ritually — Kairo Studio',
      text: 'A living editorial study in porcelain, pigment, and contemporary culture.',
      url: window.location.href,
    };
    try {
      if (typeof navigator.share === 'function') {
        await navigator.share(shareData);
        setStatus('SHARE SHEET OPENED');
        return;
      }
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareData.url);
        setStatus('LINK COPIED');
        return;
      }
      setStatus('COPY THE WEBSITE URL FROM YOUR ADDRESS BAR');
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') return;
      setStatus('SHARING FAILED — COPY THE WEBSITE URL MANUALLY');
    }
  }

  return (
    <span className="share-site-wrap">
      <button type="button" className="share-site-button" onClick={shareSite}>SHARE THIS STUDY <span aria-hidden="true">↗</span></button>
      <span className="share-site-status" role="status" aria-live="polite">{status}</span>
    </span>
  );
}
