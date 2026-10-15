import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const profileRequest = useRef(0);
  const activeUser = useRef(null);
  const invalidateProfile = useCallback(() => { ++profileRequest.current; }, []);
  const loadProfile = useCallback(async (userId) => {
    const request = ++profileRequest.current;
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .eq("id", userId)
      .maybeSingle();
    if (request !== profileRequest.current || activeUser.current !== userId) return null;
    if (error) {
      console.warn("Profile load failed", error);
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  }, []);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let mounted = true;
    let timer;
    const applySession = (nextSession) => {
      if (!mounted) return;
      const userId = nextSession?.user?.id || null;
      const changed = activeUser.current !== userId;
      activeUser.current = userId;
      setSession(nextSession);
      if (changed || !userId) {
        ++profileRequest.current;
        setProfile(null);
      }
      if (!userId) { setLoading(false); return; }
      if (changed) setLoading(true);
      // Supabase auth callbacks run under an auth lock. Query profiles only
      // after the callback returns so token refresh cannot deadlock the CMS.
      clearTimeout(timer);
      timer = setTimeout(() => {
        loadProfile(userId).finally(() => {
          if (mounted && activeUser.current === userId) setLoading(false);
        });
      }, 0);
    };
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      applySession(nextSession);
    });
    supabase.auth.getSession().then(({ data, error }) => {
      if (error && mounted) { setLoading(false); return; }
      if (!activeUser.current) applySession(data.session);
    }).catch(() => { if (mounted) setLoading(false); });
    return () => {
      mounted = false;
      clearTimeout(timer);
      invalidateProfile();
      subscription.unsubscribe();
    };
  }, [loadProfile, invalidateProfile]);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    // The auth event loads the profile after releasing the auth lock.
    return data;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    activeUser.current = null;
    ++profileRequest.current;
    setProfile(null);
    setSession(null);
  }, []);

  const updateOwnPassword = useCallback(async (newPassword) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) throw error;
  }, []);

  const updateOwnProfile = useCallback(
    async ({ full_name }) => {
      if (!supabase || !session?.user) throw new Error("Not signed in");
      const { error } = await supabase
        .from("profiles")
        .update({ full_name })
        .eq("id", session.user.id);
      if (error) throw error;
      await loadProfile(session.user.id);
    },
    [session, loadProfile],
  );

  const role = profile?.role || null;
  const isSuper = role === "super";
  const isAdmin = role === "admin" || role === "super";
  const canEdit = isAdmin;
  const isStaff = Boolean(role);

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      profile,
      role,
      loading,
      configured: isSupabaseConfigured,
      isSuper,
      isAdmin,
      canEdit,
      isStaff,
      signIn,
      signOut,
      updateOwnPassword,
      updateOwnProfile,
      refreshProfile: () =>
        session?.user ? loadProfile(session.user.id) : Promise.resolve(null),
    }),
    [
      session,
      profile,
      role,
      loading,
      isSuper,
      isAdmin,
      canEdit,
      isStaff,
      signIn,
      signOut,
      updateOwnPassword,
      updateOwnProfile,
      loadProfile,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
