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
  // Success shows no notice — the connected view already says so. This is
  // null on purpose, which is exactly why the lookup below tests membership
  // rather than using `??`.
  connected: null,
  full: {
    kind: 'full',
    tone: 'notice',
    title: 'The beta is full',
    body: "We're capped on connected athletes while Strava reviews the app. Join the waitlist and we'll open your locker as soon as a slot frees up.",
  },
  denied: {
    kind: 'denied',
    tone: 'notice',
    title: 'No problem',
    body: 'You cancelled on Strava, so nothing was shared. You can connect any time.',
  },
  error: {
    kind: 'error',
    tone: 'error',
    title: "That didn't go through",
    body: 'Something broke on the way back from Strava. Worth another try.',
  },
};

const meEndpoint = (lifespan, includeHidden) => {
  const params = new URLSearchParams();
  if (lifespan) params.set('lifespan', String(lifespan));
  if (includeHidden) params.set('includeHidden', '1');
  const query = params.toString();
  return `/api/strava/me${query ? `?${query}` : ''}`;
};

export function useStrava({ lifespan } = {}) {
  const [showHidden, setShowHidden] = useState(false);
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
      // `??` would treat the deliberate null for 'connected' as an unknown
      // flag and fall through to the error notice — which is precisely what
      // it did, showing "that didn't go through" on every success.
      setOutcome(Object.hasOwn(OUTCOMES, flag) ? OUTCOMES[flag] : OUTCOMES.error);
      // Drop the parameter so a refresh doesn't replay the message.
      const url = new URL(window.location.href);
      url.searchParams.delete('strava');
      window.history.replaceState({}, '', url);
    }

    let cancelled = false;
    const meUrl = meEndpoint(lifespan, showHidden);

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
  }, [lifespan, showHidden]);

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
      const fresh = await fetch(meEndpoint(lifespan, showHidden)).then((r) => r.json());
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

  /**
   * Hide a pair from the locker, or put it back. Strava is untouched — this
   * only controls what the locker shows, and it survives syncs.
   */
  const setShoeHidden = async (gearId, hidden) => {
    // Optimistic: the row disappears immediately, which is the whole point.
    setState((s) => ({
      ...s,
      locker: showHidden
        ? s.locker.map((sh) => (sh.id === gearId ? { ...sh, hidden } : sh))
        : s.locker.filter((sh) => sh.id !== gearId),
      hiddenCount: (s.hiddenCount ?? 0) + (hidden ? 1 : -1),
    }));

    try {
      const response = await fetch('/api/strava/shoe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gearId, hidden }),
      });
      if (!response.ok) throw new Error(String(response.status));
    } catch (err) {
      // Put it back rather than leaving the view lying about the server.
      console.error('could not update shoe visibility', err);
      const fresh = await fetch(meEndpoint(lifespan, showHidden)).then((r) => r.json());
      setState((s) => ({ ...s, ...fresh, locker: fresh.locker ?? [] }));
    }
  };

  return {
    ...state,
    outcome,
    connect,
    disconnect,
    sync,
    setShoeHidden,
    showHidden,
    toggleShowHidden: () => setShowHidden((v) => !v),
    dismissOutcome: () => setOutcome(null),
  };
}
