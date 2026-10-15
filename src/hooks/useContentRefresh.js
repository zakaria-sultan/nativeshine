import { useEffect } from 'react';

export function announceContentChange() {
  window.dispatchEvent(new Event('nativeshine:content-changed'));
  // Storage events refresh other open tabs, including admin's "View site" tab.
  try { localStorage.setItem('nativeshine:content-changed', `${Date.now()}-${Math.random()}`); } catch { /* private browsing */ }
}

export function useContentRefresh(refresh) {
  useEffect(() => {
    const update = () => { if (document.visibilityState !== 'hidden') void refresh(); };
    const onStorage = event => { if (event.key === 'nativeshine:content-changed') update(); };
    update();
    window.addEventListener('focus', update);
    window.addEventListener('online', update);
    window.addEventListener('nativeshine:content-changed', update);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', update);
    const timer = setInterval(update, 60_000);
    return () => {
      clearInterval(timer);
      window.removeEventListener('focus', update);
      window.removeEventListener('online', update);
      window.removeEventListener('nativeshine:content-changed', update);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', update);
    };
  }, [refresh]);
}
