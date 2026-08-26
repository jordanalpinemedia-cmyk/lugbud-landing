import { useEffect, useState } from 'react';

/**
 * Strava connection state.
 *
 * `/api/strava/start` bounces the visitor back with a `?strava=` flag rather
 * than leaving them on a Strava error page — notably `full`, which is how a
 * capped app has to behave (Strava allows 1 athlete until you self-upgrade to
 * 10, and more only after review).
 */
const OUTCOMES = {
  connected: null, // handled by the connected view
  full: {
    tone: 'notice',
    title: 'The beta is full',
    body: "We're capped on connected athletes while Strava reviews the app. Join the waitlist and we'll open your locker as soon as a slot frees up.",
  },
  denied: {
    tone: 'notice',
    title: 'No problem',
    body: 'You cancelled on Strava, so nothing was shared. You can connect any time.',
  },
  error: {
    tone: 'error',
    title: "That didn't go through",
    body: 'Something broke on the way back from Strava. Worth another try.',
  },
};

export function useStrava() {
  const [state, setState] = useState({ loading: true, connected: false, shoes: [] });
  const [outcome, setOutcome] = useState(null);

  useEffect(() => {
    const flag = new URLSearchParams(window.location.search).get('strava');
    if (flag) {
      setOutcome(OUTCOMES[flag] ?? OUTCOMES.error);
      // Drop the parameter so a refresh doesn't replay the message.
      const url = new URL(window.location.href);
      url.searchParams.delete('strava');
      window.history.replaceState({}, '', url);
    }

    let cancelled = false;
    fetch('/api/strava/me')
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setState({ loading: false, ...d, shoes: d.shoes ?? [] });
      })
      .catch(() => {
        if (!cancelled) setState({ loading: false, connected: false, shoes: [] });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const connect = () => {
    window.location.href = '/api/strava/start';
  };

  const disconnect = async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      await fetch('/api/strava/disconnect', { method: 'POST' });
    } finally {
      setState({ loading: false, connected: false, shoes: [] });
      setOutcome(null);
    }
  };

  return { ...state, outcome, connect, disconnect, dismissOutcome: () => setOutcome(null) };
}
