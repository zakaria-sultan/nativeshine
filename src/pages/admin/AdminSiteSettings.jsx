import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { contentSaveError, saveSiteSettings } from '../../lib/siteContentApi';
import { mapEmbedUrl, phoneHref, whatsappHref } from '../../lib/siteContent';
import { announceContentChange } from '../../hooks/useContentRefresh';

const fields = [
  ['office_phone', 'Office phone', 'tel'],
  ['mobile_phone', 'Mobile / WhatsApp phone', 'tel'],
  ['email', 'Enquiry email', 'email'],
  ['address', 'Office address', 'textarea'],
  ['office_hours', 'Office hours', 'text'],
];

export default function AdminSiteSettings() {
  const { canEdit } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const request = useRef(0);
  const load = useCallback(async () => {
    const current = ++request.current;
    setError('');
    const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).single();
    if (current !== request.current) return;
    if (error) setError(error.message); else setForm(data);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const save = async event => {
    event.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    try {
      const saved = await saveSiteSettings(supabase, form);
      setForm(saved);
      announceContentChange();
      showToast('Contact details saved. The website and map now use these details.');
    } catch (error) { showToast(contentSaveError(error), 'error'); }
    finally { setSaving(false); }
  };
  if (error) return <div role="alert">Could not load contact settings. <button onClick={load} className="underline">Try again</button></div>;
  if (!form) return <p>Loading contact settings…</p>;
  return <div className="max-w-3xl">
    <h2 className="text-2xl font-black">Contact & location</h2>
    <p className="mt-2 text-sm text-slate-500">These details are shared across the website. The Google Map follows the office address automatically.</p>
    {!canEdit && <p className="mt-3 text-amber-700">Your account has read-only access.</p>}
    <form onSubmit={save} className="mt-6 space-y-5 border border-slate-200 bg-white p-6">
      {fields.map(([key, label, type]) => <div key={key}>
        <label htmlFor={key} className="mb-2 block text-sm font-bold">{label}</label>
        {type === 'textarea' ? <textarea id={key} value={form[key]} rows={3} maxLength={500} required disabled={!canEdit || saving}
          onChange={event => setForm({ ...form, [key]: event.target.value })} className="w-full border border-slate-200 p-3 text-sm" />
          : <input id={key} type={type} value={form[key]} maxLength={key.includes('phone') ? 30 : 200} required disabled={!canEdit || saving}
            onChange={event => setForm({ ...form, [key]: event.target.value })} className="w-full border border-slate-200 p-3 text-sm" />}
        {key === 'mobile_phone' && <p className="mt-1 text-xs text-slate-500">Use +country code for numbers outside the UK. This number also updates the WhatsApp link.</p>}
        {key === 'email' && <p className="mt-1 text-xs text-slate-500">Contact and quote enquiries use this address. A new address needs activation through FormSubmit's confirmation email.</p>}
      </div>)}
      {canEdit && <button disabled={saving} className="bg-[#0ea5e9] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save contact details'}</button>}
    </form>
    <div className="mt-6 space-y-3 border border-slate-200 bg-white p-6">
      <h3 className="font-bold">Preview</h3>
      <p className="whitespace-pre-line">{form.address}</p>
      <div className="flex flex-wrap gap-4 text-sm text-sky-700"><a href={phoneHref(form.office_phone)}>Office: {form.office_phone}</a><a href={`mailto:${form.email}`}>{form.email}</a><a href={whatsappHref(form.mobile_phone)} target="_blank" rel="noreferrer">WhatsApp</a></div>
      <iframe title="Office map preview" src={mapEmbedUrl(form.address)} className="h-72 w-full border-0" loading="lazy" />
    </div>
  </div>;
}
