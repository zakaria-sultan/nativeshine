import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { fetchSiteContent } from '../lib/siteContentApi';
import { useContentRefresh } from '../hooks/useContentRefresh';

const SiteContentContext = createContext(null);

export function SiteContentProvider({ children }) {
  const [content, setContent] = useState({ settings: null, slides: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const request = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++request.current;
    try {
      if (!supabase) throw new Error('Website content is not configured.');
      const next = await fetchSiteContent(supabase);
      if (current === request.current) { setContent(next); setError(null); }
    } catch (err) {
      // Keep the last confirmed database values. Never replace edits with defaults.
      if (current === request.current) setError(err.message || 'Could not load website content.');
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, []);
  useContentRefresh(refresh);
  return <SiteContentContext.Provider value={{ ...content, loading, error, refresh }}>{children}</SiteContentContext.Provider>;
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (!context) throw new Error('useSiteContent must be used within SiteContentProvider');
  return context;
}
