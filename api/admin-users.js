import { createClient } from "@supabase/supabase-js";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method === "OPTIONS") {
    for (const [k, v] of Object.entries(cors)) res.setHeader(k, v);
    res.statusCode = 204;
    return res.end();
  }

  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anonKey =
      process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !serviceKey || !anonKey) {
      return json(res, 500, {
        error:
          "Server missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY / anon key",
      });
    }

    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return json(res, 401, { error: "Missing authorization" });
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();
    if (userError || !user) return json(res, 401, { error: "Unauthorized" });

    const admin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: profile, error: profileError } = await admin
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || profile?.role !== "super") {
      return json(res, 403, { error: "Forbidden: super role required" });
    }

    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : req.body || {};
    const action =
      body.action ||
      (req.method === "GET" ? "list" : null) ||
      "list";

    if (action === "list" || req.method === "GET") {
      const { data, error } = await admin
        .from("profiles")
        .select("id, email, full_name, role, created_at, updated_at")
        .order("created_at", { ascending: true });
      if (error) return json(res, 400, { error: error.message });
      return json(res, 200, { users: data ?? [] });
    }

    if (action === "create") {
      const { email, password, full_name, role = "user" } = body;
      if (!email || !password) {
        return json(res, 400, { error: "email and password required" });
      }
      if (!["super", "admin", "user"].includes(role)) {
        return json(res, 400, { error: "invalid role" });
      }
      const { data: created, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: full_name || "", role },
      });
      if (error) return json(res, 400, { error: error.message });

      await admin
        .from("profiles")
        .update({ full_name: full_name || "", role, email })
        .eq("id", created.user.id);

      return json(res, 200, {
        user: {
          id: created.user.id,
          email,
          full_name: full_name || "",
          role,
        },
      });
    }

    if (action === "update") {
      const { id, full_name, role, password, email } = body;
      if (!id) return json(res, 400, { error: "id required" });

      if (password) {
        const { error } = await admin.auth.admin.updateUserById(id, {
          password,
        });
        if (error) return json(res, 400, { error: error.message });
      }
      if (email) {
        const { error } = await admin.auth.admin.updateUserById(id, { email });
        if (error) return json(res, 400, { error: error.message });
      }

      const patch = {};
      if (typeof full_name === "string") patch.full_name = full_name;
      if (role && ["super", "admin", "user"].includes(role)) patch.role = role;
      if (email) patch.email = email;

      if (Object.keys(patch).length) {
        const { error } = await admin.from("profiles").update(patch).eq("id", id);
        if (error) return json(res, 400, { error: error.message });
      }

      const { data } = await admin
        .from("profiles")
        .select("id, email, full_name, role, created_at, updated_at")
        .eq("id", id)
        .single();
      return json(res, 200, { user: data });
    }

    if (action === "delete") {
      const { id } = body;
      if (!id) return json(res, 400, { error: "id required" });
      if (id === user.id) {
        return json(res, 400, { error: "Cannot delete your own account" });
      }
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return json(res, 400, { error: error.message });
      return json(res, 200, { ok: true });
    }

    return json(res, 400, { error: `Unknown action: ${action}` });
  } catch (err) {
    return json(res, 500, {
      error: err instanceof Error ? err.message : "Server error",
    });
  }
}
