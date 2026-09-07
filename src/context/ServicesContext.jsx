import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { servicesData as staticServices } from "../data/servicesData";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { fetchServicesFromSupabase } from "../lib/servicesApi";
import { getHomeHeroFromAssets } from "../lib/resolveServiceImages";

const ServicesContext = createContext(null);

export function ServicesProvider({ children }) {
  const [services, setServices] = useState(staticServices);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [source, setSource] = useState("static");
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setServices(staticServices);
      setSource("static");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const rows = await fetchServicesFromSupabase(supabase, {
        includeUnpublished: false,
      });
      if (rows.length === 0) {
        setServices(staticServices);
        setSource("static-fallback");
      } else {
        setServices(rows);
        setSource("supabase");
      }
    } catch (err) {
      console.warn("Services fetch failed, using static fallback", err);
      setError(err?.message || "Failed to load services");
      setServices(staticServices);
      setSource("static-fallback");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const getBySlug = useCallback(
    (slug) => services.find((s) => s.slug === slug) || null,
    [services],
  );

  const homeHero = useMemo(() => {
    if (source === "supabase") {
      const carpet = services.find((s) => s.slug === "carpet-cleaning");
      const windowSvc = services.find((s) => s.slug === "window-cleaning");
      const specialist = services.find((s) => s.slug === "specialist-services");
      const front = services.find((s) => s.slug === "front-of-house");
      return {
        slide1:
          carpet?.imageHero ||
          carpet?.imageThumbnail ||
          front?.imageHero ||
          getHomeHeroFromAssets().slide1,
        slide2:
          windowSvc?.imageHero ||
          specialist?.imageHero ||
          getHomeHeroFromAssets().slide2,
      };
    }
    return getHomeHeroFromAssets();
  }, [services, source]);

  const value = useMemo(
    () => ({
      services,
      loading,
      source,
      error,
      refresh,
      getBySlug,
      homeHero,
    }),
    [services, loading, source, error, refresh, getBySlug, homeHero],
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
