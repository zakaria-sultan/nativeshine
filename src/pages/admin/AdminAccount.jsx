import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import PasswordField from "../../components/admin/PasswordField";

export default function AdminAccount() {
  const { profile, updateOwnPassword, updateOwnProfile } = useAuth();
  const { showToast } = useToast();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name || "");
  }, [profile?.full_name]);

  const onSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateOwnProfile({ full_name: fullName });
      showToast("Profile updated", "success");
    } catch (err) {
      showToast(err.message || "Profile update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const onSavePassword = async (e) => {
    e.preventDefault();
    if (password.length < 8) {
      showToast("Password must be at least 8 characters", "error");
      return;
    }
    if (password !== confirm) {
      showToast("Passwords do not match", "error");
      return;
    }
    setSaving(true);
    try {
      await updateOwnPassword(password);
      setPassword("");
      setConfirm("");
      showToast("Password updated", "success");
    } catch (err) {
      showToast(err.message || "Password update failed", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-black tracking-tight">Account</h2>
      <p className="mt-1 text-sm text-slate-500">{profile?.email}</p>

      <form
        onSubmit={onSaveProfile}
        className="mt-8 space-y-4 border border-slate-200 bg-white p-6"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-[#0ea5e9]">
          Profile
        </h3>
        <div>
          <label className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500">
            Full name
          </label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-[#0ea5e9]"
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="bg-[#0ea5e9] px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-slate-900 disabled:opacity-60"
        >
          Save profile
        </button>
      </form>

      <form
        onSubmit={onSavePassword}
        className="mt-6 space-y-4 border border-slate-200 bg-white p-6"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-[#0ea5e9]">
          Change password
        </h3>
        <PasswordField
          label="New password"
          name="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />
        <PasswordField
          label="Confirm password"
          name="confirm-password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          required
          autoComplete="new-password"
        />
        <button
          type="submit"
          disabled={saving}
          className="bg-slate-900 px-4 py-2.5 text-xs font-black uppercase tracking-widest text-white hover:bg-[#0ea5e9] disabled:opacity-60"
        >
          Update password
        </button>
      </form>
    </div>
  );
}
