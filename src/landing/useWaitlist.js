import { useState } from 'react';

/**
 * Local-only waitlist form state. The real page would POST the address; here
 * submitting just flips to the confirmation panel.
 */
export function useWaitlist() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  return {
    email,
    submitted,
    onEmail: (e) => setEmail(e.target.value),
    onSubmit: (e) => {
      e.preventDefault();
      setSubmitted(true);
    },
  };
}
