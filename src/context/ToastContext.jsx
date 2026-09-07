import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

const STYLES = {
  success: {
    border: "border-emerald-200",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
    bar: "bg-emerald-500",
  },
  error: {
    border: "border-red-200",
    icon: XCircle,
    iconClass: "text-red-500",
    bar: "bg-red-500",
  },
  info: {
    border: "border-sky-200",
    icon: Info,
    iconClass: "text-[#0ea5e9]",
    bar: "bg-[#0ea5e9]",
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev.slice(-4), { message, type, id }]);
  }, []);

  React.useEffect(() => {
    if (!toasts.length) return undefined;
    const timers = toasts.map((t) =>
      setTimeout(() => dismiss(t.id), 4200),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dismiss]);

  const node =
    typeof document !== "undefined"
      ? createPortal(
          <div className="pointer-events-none fixed bottom-6 left-1/2 z-[250] flex w-[min(92vw,420px)] -translate-x-1/2 flex-col gap-2">
            <AnimatePresence>
              {toasts.map((toast) => {
                const style = STYLES[toast.type] || STYLES.success;
                const Icon = style.icon;
                return (
                  <motion.div
                    key={toast.id}
                    role="alert"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ type: "spring", damping: 24, stiffness: 320 }}
                    className={`pointer-events-auto relative overflow-hidden rounded-lg border bg-white px-4 py-3 pr-10 shadow-xl shadow-slate-900/15 ${style.border}`}
                  >
                    <div className={`absolute inset-x-0 top-0 h-0.5 ${style.bar}`} />
                    <div className="flex items-start gap-3">
                      <Icon
                        className={`mt-0.5 shrink-0 ${style.iconClass}`}
                        size={22}
                        aria-hidden
                      />
                      <p className="text-sm font-semibold leading-snug text-slate-800">
                        {toast.message}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismiss(toast.id)}
                      className="absolute top-2 right-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Dismiss notification"
                    >
                      <X size={18} />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>,
          document.body,
        )
      : null;

  return (
    <ToastContext.Provider value={{ showToast, dismiss }}>
      {children}
      {node}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
