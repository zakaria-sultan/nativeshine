import React, { createContext, useCallback, useContext, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const dismiss = useCallback(() => setToast(null), []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  React.useEffect(() => {
    if (!toast) return;
    const t = setTimeout(dismiss, 5000);
    return () => clearTimeout(t);
  }, [toast, dismiss]);

  const node =
    typeof document !== "undefined"
      ? createPortal(
          <AnimatePresence>
            {toast && (
              <motion.div
                key={toast.id}
                role="alert"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ type: "spring", damping: 24, stiffness: 320 }}
                className={
                  toast.type === "error"
                    ? "fixed bottom-6 left-1/2 z-[250] flex max-w-[min(92vw,420px)] -translate-x-1/2 items-start gap-3 rounded-lg border border-red-200 bg-white px-4 py-3 pr-10 shadow-xl shadow-slate-900/15"
                    : "fixed bottom-6 left-1/2 z-[250] flex max-w-[min(92vw,420px)] -translate-x-1/2 items-start gap-3 rounded-lg border border-emerald-200 bg-white px-4 py-3 pr-10 shadow-xl shadow-slate-900/15"
                }
              >
                {toast.type === "error" ? (
                  <XCircle
                    className="mt-0.5 shrink-0 text-red-500"
                    size={22}
                    aria-hidden
                  />
                ) : (
                  <CheckCircle2
                    className="mt-0.5 shrink-0 text-emerald-500"
                    size={22}
                    aria-hidden
                  />
                )}
                <p className="text-sm font-semibold text-slate-800 leading-snug">
                  {toast.message}
                </p>
                <button
                  type="button"
                  onClick={dismiss}
                  className="absolute top-2 right-2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                  aria-label="Dismiss notification"
                >
                  <X size={18} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>,
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
