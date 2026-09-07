// Supabase Edge Function: admin user management (super role only)
// Deploy: supabase functions deploy admin-users

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

type Role = "super" | "admin" | "user";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json({ error: "Missing authorization" }, 401);

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    const admin = createClient(supabaseUrl, serviceKey);

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "super") {
      return json({ error: "Forbidden: super role required" }, 403);
    }

    const body = req.method === "GET" ? {} : await req.json().catch(() => ({}));
    const action =
      (body as { action?: string }).action ||
      new URL(req.url).searchParams.get("action") ||
      "list";

    if (action === "list" || req.method === "GET") {
      const { data, error } = await admin
        .from("profiles")
        .select("id, email, full_name, role, created_at, updated_at")
        .order("created_at", { ascending: true });
      if (error) return json({ error: error.message }, 400);
      return json({ users: data ?? [] });
    }

    if (action === "create") {
      const {
        email,
        password,
        full_name,
        role = "user",
      } = body as {
        email?: string;
        password?: string;
        full_name?: string;
        role?: Role;
      };
      if (!email || !password) {
        return json({ error: "email and password required" }, 400);
      }
      if (!["super", "admin", "user"].includes(role)) {
        return json({ error: "invalid role" }, 400);
      }
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || "", role },
      });
      if (error) return json({ error: error.message }, 400);

      await admin
        .from("profiles")
        .update({
          full_name: full_name || "",
          role,
          email,
        })
        .eq("id", created.user.id);

      return json({
        user: {
          id: created.user.id,
          email,
          full_name: full_name || "",
          role,
        },
      });
    }

    if (action === "update") {
      const {
        id,
        full_name,
        role,
        password,
        email,
      } = body as {
        id?: string;
        full_name?: string;
        role?: Role;
        password?: string;
        email?: string;
      };
      if (!id) return json({ error: "id required" }, 400);

      if (password) {
        const { error } = await admin.auth.admin.updateUserById(id, {
          password,
        });
        if (error) return json({ error: error.message }, 400);
      }
      if (email) {
        const { error } = await admin.auth.admin.updateUserById(id, { email });
        if (error) return json({ error: error.message }, 400);
      }

      const patch: Record<string, unknown> = {};
      if (typeof full_name === "string") patch.full_name = full_name;
      if (role && ["super", "admin", "user"].includes(role)) patch.role = role;
      if (email) patch.email = email;

      if (Object.keys(patch).length) {
        const { error } = await admin.from("profiles").update(patch).eq("id", id);
        if (error) return json({ error: error.message }, 400);
      }

      const { data } = await admin
        .from("profiles")
        .select("id, email, full_name, role, created_at, updated_at")
        .eq("id", id)
        .single();
      return json({ user: data });
    }

    if (action === "delete") {
      const { id } = body as { id?: string };
      if (!id) return json({ error: "id required" }, 400);
      if (id === user.id) {
        return json({ error: "Cannot delete your own account" }, 400);
      }
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json({ error: error.message }, 400);
      return json({ ok: true });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server error";
    return json({ error: message }, 500);
  }
});
