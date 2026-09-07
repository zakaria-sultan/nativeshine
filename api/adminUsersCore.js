import { createClient } from "@supabase/supabase-js";

/**
 * Shared admin-users logic for Vercel `/api` and Vite dev middleware.
 */
export async function handleAdminUsers({
  method,
  body,
  authHeader,
  env,
}) {
  const supabaseUrl = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
  const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = env.SUPABASE_ANON_KEY || env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey || !anonKey) {
    return {
      status: 500,
      body: {
        error:
          "Server missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / anon key",
      },
    };
  }

  if (!authHeader?.startsWith("Bearer ")) {
    return { status: 401, body: { error: "Missing authorization" } };
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const {
    data: { user },
    error: userError,
  } = await userClient.auth.getUser();
  if (userError || !user) {
    return { status: 401, body: { error: "Unauthorized" } };
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: profile, error: profileError } = await admin
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profileError || profile?.role !== "super") {
    return { status: 403, body: { error: "Forbidden: super role required" } };
  }

  const payload =
    typeof body === "string" ? JSON.parse(body || "{}") : body || {};
  const action = payload.action || (method === "GET" ? "list" : "list");

  if (action === "list" || method === "GET") {
    const { data, error } = await admin
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .order("created_at", { ascending: true });
    if (error) return { status: 400, body: { error: error.message } };
    return { status: 200, body: { users: data ?? [] } };
  }

  if (action === "create") {
    const { email, password, full_name, role = "user" } = payload;
    if (!email || !password) {
      return { status: 400, body: { error: "email and password required" } };
    }
    if (!["super", "admin", "user"].includes(role)) {
      return { status: 400, body: { error: "invalid role" } };
    }
    const { data: created, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: full_name || "", role },
    });
    if (error) return { status: 400, body: { error: error.message } };

    await admin
      .from("profiles")
      .update({ full_name: full_name || "", role, email })
      .eq("id", created.user.id);

    return {
      status: 200,
      body: {
        user: {
          id: created.user.id,
          email,
          full_name: full_name || "",
          role,
        },
      },
    };
  }

  if (action === "update") {
    const { id, full_name, role, password, email } = payload;
    if (!id) return { status: 400, body: { error: "id required" } };

    if (password) {
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return { status: 400, body: { error: error.message } };
    }
    if (email) {
      const { error } = await admin.auth.admin.updateUserById(id, { email });
      if (error) return { status: 400, body: { error: error.message } };
    }

    const patch = {};
    if (typeof full_name === "string") patch.full_name = full_name;
    if (role && ["super", "admin", "user"].includes(role)) patch.role = role;
    if (email) patch.email = email;

    if (Object.keys(patch).length) {
      const { error } = await admin.from("profiles").update(patch).eq("id", id);
      if (error) return { status: 400, body: { error: error.message } };
    }

    const { data } = await admin
      .from("profiles")
      .select("id, email, full_name, role, created_at, updated_at")
      .eq("id", id)
      .single();
    return { status: 200, body: { user: data } };
  }

  if (action === "delete") {
    const { id } = payload;
    if (!id) return { status: 400, body: { error: "id required" } };
    if (id === user.id) {
      return { status: 400, body: { error: "Cannot delete your own account" } };
    }
    const { error } = await admin.auth.admin.deleteUser(id);
    if (error) return { status: 400, body: { error: error.message } };
    return { status: 200, body: { ok: true } };
  }

  return { status: 400, body: { error: `Unknown action: ${action}` } };
}
