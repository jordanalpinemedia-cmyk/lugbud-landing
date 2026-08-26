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

export function useStrava({ lifespan } = {}) {
  const [state, setState] = useState({
    loading: true,
    connected: false,
    locker: [],
    milesThisYear: 0,
  });
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
    const meUrl = `/api/strava/me${lifespan ? `?lifespan=${lifespan}` : ''}`;

    fetch(meUrl)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setState({
            loading: false,
            ...d,
            locker: d.locker ?? [],
            milesThisYear: d.milesThisYear ?? 0,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ loading: false, connected: false, locker: [], milesThisYear: 0 });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [lifespan]);

  const connect = () => {
    window.location.href = '/api/strava/start';
  };

  const disconnect = async () => {
    setState((s) => ({ ...s, loading: true }));
    try {
      await fetch('/api/strava/disconnect', { method: 'POST' });
    } finally {
      setState({ loading: false, connected: false, locker: [], milesThisYear: 0 });
      setOutcome(null);
    }
  };

  /**
   * Pull fresh activities from Strava, then reload the locker.
   * A 401 means access was revoked and the server has already forgotten us.
   */
  const sync = async () => {
    setState((s) => ({ ...s, syncing: true }));
    try {
      const response = await fetch('/api/strava/sync', { method: 'POST' });
      if (response.status === 401) {
        setState({ loading: false, connected: false, locker: [], milesThisYear: 0 });
        return;
      }
      const fresh = await fetch(
        `/api/strava/me${lifespan ? `?lifespan=${lifespan}` : ''}`,
      ).then((r) => r.json());
      setState({
        loading: false,
        syncing: false,
        ...fresh,
        locker: fresh.locker ?? [],
        milesThisYear: fresh.milesThisYear ?? 0,
      });
    } catch {
      setState((s) => ({ ...s, syncing: false }));
    }
  };

  return { ...state, outcome, connect, disconnect, sync, dismissOutcome: () => setOutcome(null) };
}
