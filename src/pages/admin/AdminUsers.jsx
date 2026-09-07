import React, { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { Plus, Trash2, Save } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { invokeAdminUsers } from "../../lib/adminApi";
import PasswordField from "../../components/admin/PasswordField";

const emptyCreate = () => ({
  email: "",
  password: "",
  full_name: "",
  role: "admin",
});

export default function AdminUsers() {
  const { isSuper, user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [creating, setCreating] = useState(false);
  const [edits, setEdits] = useState({});

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await invokeAdminUsers("list");
      setUsers(data.users || []);
      const next = {};
      for (const u of data.users || []) {
        next[u.id] = {
          full_name: u.full_name || "",
          role: u.role,
          password: "",
        };
      }
      setEdits(next);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isSuper) load();
  }, [isSuper, load]);

  if (!isSuper) {
    return <Navigate to="/admin" replace />;
  }

  const onCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setError("");
    setMessage("");
    try {
      await invokeAdminUsers("create", createForm);
      setCreateForm(emptyCreate());
      setMessage("User created");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const onSaveUser = async (id) => {
    const draft = edits[id];
    if (!draft) return;
    setError("");
    setMessage("");
    try {
      await invokeAdminUsers("update", {
        id,
        full_name: draft.full_name,
        role: draft.role,
        password: draft.password || undefined,
      });
      setMessage("User updated");
      setEdits((prev) => ({
        ...prev,
        [id]: { ...prev[id], password: "" },
      }));
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  const onDelete = async (id, email) => {
    if (!window.confirm(`Delete user ${email}?`)) return;
    try {
      await invokeAdminUsers("delete", { id });
      setMessage("User deleted");
      await load();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-black tracking-tight">Users</h2>
      <p className="mt-1 text-sm text-slate-500">
        Super users can create accounts, change roles, and set passwords.
      </p>

      <form
        onSubmit={onCreate}
        className="mt-6 space-y-4 border border-slate-200 bg-white p-6"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-[#0ea5e9]">
          Create user
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Full name
            </label>
            <input
              value={createForm.full_name}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, full_name: e.target.value }))
              }
              className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Role
            </label>
            <select
              value={createForm.role}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, role: e.target.value }))
              }
              className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
            >
              <option value="admin">admin</option>
              <option value="user">user</option>
              <option value="super">super</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
              Email
            </label>
            <input
              type="email"
              required
              value={createForm.email}
              onChange={(e) =>
                setCreateForm((p) => ({ ...p, email: e.target.value }))
              }
              className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
            />
          </div>
          <PasswordField
            label="Password"
            name="create-password"
            value={createForm.password}
            onChange={(e) =>
              setCreateForm((p) => ({ ...p, password: e.target.value }))
            }
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center gap-2 bg-[#0ea5e9] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-900 disabled:opacity-60"
        >
          <Plus size={14} /> {creating ? "Creating…" : "Create user"}
        </button>
      </form>

      <div className="mt-8 space-y-4">
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : (
          users.map((u) => {
            const draft = edits[u.id] || {
              full_name: "",
              role: u.role,
              password: "",
            };
            return (
              <div
                key={u.id}
                className="border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-900">{u.email}</p>
                    <p className="text-xs text-slate-400">
                      ID: {u.id.slice(0, 8)}…
                    </p>
                  </div>
                  {u.id !== user?.id ? (
                    <button
                      type="button"
                      onClick={() => onDelete(u.id, u.email)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:underline"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  ) : (
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      You
                    </span>
                  )}
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Name
                    </label>
                    <input
                      value={draft.full_name}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [u.id]: { ...draft, full_name: e.target.value },
                        }))
                      }
                      className="w-full border border-slate-200 px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Role
                    </label>
                    <select
                      value={draft.role}
                      onChange={(e) =>
                        setEdits((prev) => ({
                          ...prev,
                          [u.id]: { ...draft, role: e.target.value },
                        }))
                      }
                      className="w-full border border-slate-200 px-3 py-2 text-sm"
                    >
                      <option value="super">super</option>
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </div>
                  <PasswordField
                    label="New password (optional)"
                    name={`pw-${u.id}`}
                    value={draft.password}
                    onChange={(e) =>
                      setEdits((prev) => ({
                        ...prev,
                        [u.id]: { ...draft, password: e.target.value },
                      }))
                    }
                    autoComplete="new-password"
                    placeholder="Leave blank to keep"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => onSaveUser(u.id)}
                  className="mt-4 inline-flex items-center gap-2 border border-slate-200 px-3 py-2 text-xs font-black uppercase tracking-widest text-slate-700 hover:border-[#0ea5e9] hover:text-[#0ea5e9]"
                >
                  <Save size={14} /> Save changes
                </button>
              </div>
            );
          })
        )}
      </div>

      {message ? (
        <p className="mt-4 rounded-sm bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="mt-4 rounded-sm bg-rose-50 px-3 py-2 text-sm text-rose-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
