import { useState } from 'react';

/**
 * Waitlist form state. Posts to /api/waitlist, which forwards to Resend with
 * the API key held server-side.
 *
 * `getPayload` supplies extra fields at submit time — the hero form uses it to
 * send the selected brand. It is read on submit, not on mount, so it always
 * sees current state.
 */
export function useWaitlist({ getPayload } = {}) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [error, setError] = useState(null);

  // Honeypot: rendered off-screen and hidden from assistive tech, so only an
  // automated form-filler ever populates it. The server discards those.
  const [website, setWebsite] = useState('');

  const onEmail = (e) => {
    setEmail(e.target.value);
    // Clear a previous failure as soon as they start correcting it.
    if (status === 'error') {
      setStatus('idle');
      setError(null);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    setStatus('sending');
    setError(null);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, website, ...(getPayload ? getPayload() : null) }),
      });

      const body = await response.json().catch(() => ({}));

      if (response.ok) {
        setStatus('done');
        return;
      }

      setError(body.error || "We couldn't save that just now. Try again in a moment.");
      setStatus('error');
    } catch {
      setError('That request did not go through. Check your connection and try again.');
      setStatus('error');
    }
  };

  return {
    email,
    error,
    onEmail,
    onSubmit,
    trapProps: {
      name: 'website',
      value: website,
      onChange: (e) => setWebsite(e.target.value),
    },
    sending: status === 'sending',
    submitted: status === 'done',
  };
}
