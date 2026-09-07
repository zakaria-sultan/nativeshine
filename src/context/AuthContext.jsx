import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  const loadProfile = useCallback(async (userId) => {
    if (!supabase || !userId) {
      setProfile(null);
      return null;
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("id, email, full_name, role, created_at")
      .eq("id", userId)
      .maybeSingle();
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
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      if (data.session?.user) {
        loadProfile(data.session.user.id).finally(() => {
          if (mounted) setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      if (nextSession?.user) {
        loadProfile(nextSession.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email, password) => {
    if (!supabase) throw new Error("Supabase is not configured");
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    await loadProfile(data.user.id);
    return data;
  }, [loadProfile]);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
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
