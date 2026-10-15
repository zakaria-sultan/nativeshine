import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useRef,
} from "react";
import { useContentRefresh } from "../hooks/useContentRefresh";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { fetchServicesFromSupabase } from "../lib/servicesApi";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [source, setSource] = useState("loading");
  const [error, setError] = useState(null);

  const request = useRef(0);
  const refresh = useCallback(async () => {
    const current = ++request.current;
    try {
      if (!isSupabaseConfigured || !supabase) throw new Error("Services are not configured.");
      const rows = await fetchServicesFromSupabase(supabase, {
        includeUnpublished: false,
      });
      if (current === request.current) {
        setServices(rows);
        setSource("supabase");
        setError(null);
      }
    } catch (err) {
      if (current === request.current) {
        setError(err?.message || "Failed to load services");
        setSource("unavailable");
      }
    } finally {
      if (current === request.current) setLoading(false);
    }
  }, []);

  useContentRefresh(refresh);

  const getBySlug = useCallback(
    (slug) => services.find((s) => s.slug === slug) || null,
    [services],
  );

  const value = useMemo(
    () => ({
      services,
      loading,
      source,
      error,
      refresh,
      getBySlug,
    }),
    [services, loading, source, error, refresh, getBySlug],
  );

  return (
    <ServicesContext.Provider value={value}>{children}</ServicesContext.Provider>
  );
}

export function useServices() {
  const ctx = useContext(ServicesContext);
  if (!ctx) {
    throw new Error("useServices must be used within ServicesProvider");
  }
  return ctx;
}
