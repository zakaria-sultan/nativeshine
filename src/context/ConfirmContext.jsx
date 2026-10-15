import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Trash2 } from 'lucide-react';

const ConfirmContext = createContext(null);

function Confirmation({ message, settle }) {
  const dialog = useRef(null);
  useEffect(() => {
    const element = dialog.current;
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    element.showModal();
    return () => {
      element.close();
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  return createPortal(
    <dialog ref={dialog} role="alertdialog" aria-labelledby="confirm-title" aria-describedby="confirm-description"
      onCancel={event => { event.preventDefault(); settle(false); }}
      onClick={event => { if (event.target === dialog.current) {
        const bounds = dialog.current.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) settle(false);
      } }}
      className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-0 text-slate-900 shadow-2xl backdrop:bg-slate-950/60 backdrop:backdrop-blur-sm">
      <div className="p-6 sm:p-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><Trash2 size={24} aria-hidden="true" /></div>
        <h2 id="confirm-title" className="text-xl font-black">Confirm deletion</h2>
        <p id="confirm-description" className="mt-3 break-words text-sm leading-relaxed text-slate-600">{message} This action cannot be undone.</p>
      </div>
      <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4">
        <button autoFocus type="button" onClick={() => settle(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold hover:bg-slate-100 focus-visible:outline-2 focus-visible:outline-sky-500">Cancel</button>
        <button type="button" onClick={() => settle(true)} className="rounded-lg bg-rose-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-rose-500">Delete</button>
      </div>
    </dialog>, document.body);
}

export function ConfirmProvider({ children }) {
  const [message, setMessage] = useState(null);
  const pending = useRef(null);
  const settle = useCallback(result => {
    const resolve = pending.current;
    pending.current = null;
    setMessage(null);
    resolve?.(result);
  }, []);
  const confirm = useCallback(text => {
    if (pending.current) return Promise.resolve(false);
    return new Promise(resolve => { pending.current = resolve; setMessage(text); });
  }, []);
  useEffect(() => () => { pending.current?.(false); pending.current = null; }, []);
  return <ConfirmContext.Provider value={confirm}>{children}{message !== null && <Confirmation message={message} settle={settle} />}</ConfirmContext.Provider>;
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used within ConfirmProvider');
  return confirm;
}
