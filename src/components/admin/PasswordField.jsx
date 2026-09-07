import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  id,
  name,
  value,
  onChange,
  placeholder = "Password",
  autoComplete = "current-password",
  required = false,
  className = "",
  label,
}) {
  const [visible, setVisible] = useState(false);
  return (
    <div className={className}>
      {label ? (
        <label
          htmlFor={id || name}
          className="mb-1.5 block text-xs font-black uppercase tracking-widest text-slate-500"
        >
          {label}
        </label>
      ) : null}
      <div className="relative">
        <input
          id={id || name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-sm border border-slate-200 bg-white px-4 py-3 pr-12 text-sm font-medium text-slate-900 outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-[#0ea5e9]/20"
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </div>
  );
}
