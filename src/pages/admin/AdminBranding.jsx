import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { saveCompanyBranding } from '../../lib/brandingApi';
import { BRANDING_DEFAULTS, validateBrandImage } from '../../lib/branding';
import { contentSaveError } from '../../lib/siteContentApi';
import { announceContentChange } from '../../hooks/useContentRefresh';
import BrandWordmark from '../../components/branding/BrandWordmark';

function ImageChoice({ slot, label, help, current, change, disabled, onChange }) {
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!change?.file) return;
    const url = URL.createObjectURL(change.file);
    const image = new Image();
    image.onload = () => setPreview({ file: change.file, url });
    image.src = url;
    return () => { image.onload = null; URL.revokeObjectURL(url); };
  }, [change?.file]);
  const source = change?.file ? (preview?.file === change.file ? preview.url : null) : change?.reset ? BRANDING_DEFAULTS[`${slot}_url`] : current[`${slot}_url`];
  return <section className="space-y-3 border border-slate-200 bg-white p-5">
    <h3 className="text-lg font-bold">{label}</h3>
    <p className="text-sm text-slate-500">{help}</p>
    <div className="flex h-32 items-center justify-center rounded border border-slate-200 bg-slate-50 p-4">
      {source ? <img src={source} alt={`${label} preview`} className={slot === 'logo' ? 'h-24 w-24 shrink-0 rounded-full object-cover' : 'h-full max-w-full object-contain'} /> : slot === 'wordmark' ? <BrandWordmark className="max-w-sm" /> : null}
    </div>
    <label htmlFor={`${slot}-upload`} className="block text-sm font-bold">Upload {label.toLowerCase()}</label>
    <input id={`${slot}-upload`} type="file" accept="image/png,image/jpeg,image/webp" disabled={disabled}
      className="block w-full min-w-0 text-sm" onChange={event => {
        const file = event.target.files?.[0];
        if (file) onChange({ file });
        event.target.value = '';
      }} />
    {change?.file && <p className="break-all text-xs text-slate-600">Selected: {change.file.name}. Save to publish.</p>}
    {change?.reset && <p className="text-xs text-slate-600">The original will be restored when you save.</p>}
    <div className="flex flex-wrap gap-3">
      <button type="button" disabled={disabled} onClick={() => onChange({ reset: true })} className="border px-3 py-2 text-xs font-bold disabled:opacity-50">Restore original {slot === 'logo' ? 'logo' : 'wordmark'}</button>
      {change && <button type="button" disabled={disabled} onClick={() => onChange(null)} className="px-3 py-2 text-xs underline">Cancel selection</button>}
    </div>
  </section>;
}

export default function AdminBranding() {
  const { canEdit } = useAuth();
  const { showToast } = useToast();
  const [current, setCurrent] = useState(null);
  const [changes, setChanges] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const request = useRef(0);
  const load = useCallback(async () => {
    const version = ++request.current;
    setError('');
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).single();
    if (version !== request.current) return;
    if (error) setError(error.message); else setCurrent(data);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const choose = (slot, change) => {
    try {
      if (change?.file) validateBrandImage(change.file);
      setChanges(previous => ({ ...previous, [slot]: change }));
    } catch (error) { showToast(error.message, 'error'); }
  };
  const save = async event => {
    event.preventDefault();
    if (!canEdit || saving) return;
    setSaving(true);
    try {
      const saved = await saveCompanyBranding(supabase, current, changes);
      setCurrent(saved);
      setChanges({});
      announceContentChange();
      showToast('Company branding saved. The website now uses your images.');
    } catch (error) { showToast(contentSaveError(error), 'error'); }
    finally { setSaving(false); }
  };
  if (error) return <div role="alert">Could not load company branding. <button onClick={load} className="underline">Try again</button></div>;
  if (!current) return <p>Loading company branding…</p>;
  return <div className="max-w-3xl">
    <h2 className="text-2xl font-black">Company logo & branding</h2>
    <p className="mt-2 text-sm text-slate-500">Change the company icon or the name-and-tagline artwork. Saved images update the header, mobile menu and footer together. The company icon also updates the browser tab icon.</p>
    <p className="mt-2 text-sm text-slate-500">Use PNG, JPG or WebP, up to 5 MB. Transparent PNG/WebP files keep their transparent background.</p>
    {!canEdit && <p className="mt-3 text-amber-700">Your account has read-only access.</p>}
    <form onSubmit={save} className="mt-6 space-y-5">
      <ImageChoice slot="logo" label="Company icon" help="Shown as a circle beside the company name. A square image with centered artwork works best." current={current} change={changes.logo} disabled={!canEdit || saving} onChange={change => choose('logo', change)} />
      <ImageChoice slot="wordmark" label="Company wordmark" help="Optional: replace the styled company name and tagline with your own wide logo image. Restore the original to use the current silver-and-blue lettering." current={current} change={changes.wordmark} disabled={!canEdit || saving} onChange={change => choose('wordmark', change)} />
      {canEdit && <button disabled={saving || !Object.values(changes).some(Boolean)} className="bg-[#0ea5e9] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save company branding'}</button>}
    </form>
  </div>;
}
