import { useConfirm } from '../../context/ConfirmContext';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { supabase } from '../../lib/supabase';
import { contentSaveError, deleteHomeSlide, saveHomeSlide } from '../../lib/siteContentApi';
import { announceContentChange } from '../../hooks/useContentRefresh';
import FastImage from '../../components/common/FastImage';

const newSlide = () => ({ title: '', subtitle: '', description: '', image_url: '', sort_order: 0, is_published: true });

function SlideEditor({ initial, canEdit, onSaved, onCancel }) {
  const [draft, setDraft] = useState({ ...initial, original_image_url: initial.image_url });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const { showToast } = useToast();
  const set = (key, value) => setDraft(previous => ({ ...previous, [key]: value }));
  const save = async event => {
    event.preventDefault();
    if (!canEdit) return;
    setSaving(true);
    try {
      const saved = await saveHomeSlide(supabase, draft, file);
      announceContentChange();
      showToast('Homepage slide saved.');
      onSaved(saved);
    } catch (error) { showToast(contentSaveError(error), 'error'); }
    finally { setSaving(false); }
  };
  return <form onSubmit={save} className="mt-4 space-y-4 border border-sky-200 bg-white p-5">
    <h3 className="font-bold">{draft.id ? 'Edit slide' : 'New slide'}</h3>
    {[
      ['title', 'Title', 250], ['subtitle', 'Subtitle', 150], ['description', 'Description', 2000], ['image_url', 'Image URL', 2000],
    ].map(([key, label, max]) => <div key={key}>
      <label htmlFor={`slide-${key}`} className="mb-1 block text-sm font-bold">{label}</label>
      {key === 'description' ? <textarea id={`slide-${key}`} value={draft[key]} rows={4} maxLength={max} disabled={!canEdit || saving}
        onChange={event => set(key, event.target.value)} className="w-full border p-3 text-sm" />
        : <input id={`slide-${key}`} type={key === 'image_url' ? 'url' : 'text'} value={draft[key]} maxLength={max}
          required={key === 'title' || (key === 'image_url' && !file)} disabled={!canEdit || saving}
          onChange={event => set(key, event.target.value)} className="w-full border p-3 text-sm" />}
    </div>)}
    <div><label htmlFor="slide-upload" className="mb-1 block text-sm font-bold">Or upload a background image</label>
      <input id="slide-upload" type="file" accept="image/png,image/jpeg,image/webp" disabled={!canEdit || saving} onChange={event => setFile(event.target.files?.[0] ?? null)} />
      {file && <p className="mt-1 text-xs text-slate-500">{file.name} will replace the image when you save.</p>}
    </div>
    <label className="block text-sm font-bold">Display order<input type="number" step="1" required value={draft.sort_order} disabled={!canEdit || saving} onChange={event => set('sort_order', event.target.value)} className="ml-3 w-24 border p-2" /></label>
    <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={draft.is_published} disabled={!canEdit || saving} onChange={event => set('is_published', event.target.checked)} />Published on homepage</label>
    <div className="flex gap-3">{canEdit && <button disabled={saving} className="bg-[#0ea5e9] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Saving…' : 'Save slide'}</button>}<button type="button" disabled={saving} onClick={onCancel} className="border px-5 py-2.5 text-sm">Cancel</button></div>
  </form>;
}

export default function AdminHomeSlides() {
  const confirmDelete = useConfirm();
  const { canEdit } = useAuth();
  const { showToast } = useToast();
  const [slides, setSlides] = useState(null);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);
  const request = useRef(0);
  const load = useCallback(async () => {
    const current = ++request.current;
    setError('');
    const { data, error } = await supabase.from('home_slides').select('*').order('sort_order').order('id');
    if (current !== request.current) return;
    if (error) setError(error.message); else setSlides(data ?? []);
  }, []);
  useEffect(() => { void load(); }, [load]);
  const remove = async slide => {
    if (!canEdit || deleting || !await confirmDelete('Delete this homepage slide?')) return;
    setDeleting(slide.id);
    try {
      await deleteHomeSlide(supabase, slide);
      announceContentChange();
      setSlides(previous => previous.filter(row => row.id !== slide.id));
      showToast('Homepage slide deleted.');
    } catch (error) { showToast(contentSaveError(error), 'error'); }
    finally { setDeleting(null); }
  };
  if (error) return <div role="alert">Could not load homepage slides. <button onClick={load} className="underline">Try again</button></div>;
  if (!slides) return <p>Loading homepage slides…</p>;
  return <div className="max-w-4xl">
    <h2 className="text-2xl font-black">Homepage slides</h2>
    <p className="mt-2 text-sm text-slate-500">Manage each slide's text and background image. Lower display orders appear first. Unpublish or delete slides to remove them from the homepage.</p>
    {canEdit && !editing && <button onClick={() => setEditing({ ...newSlide(), sort_order: Math.max(0, ...slides.map(slide => slide.sort_order)) + 1 })} className="mt-5 bg-[#0ea5e9] px-5 py-3 text-sm font-bold text-white">Add slide</button>}
    {editing && <SlideEditor key={editing.id ?? 'new'} initial={editing} canEdit={canEdit} onCancel={() => setEditing(null)} onSaved={saved => {
      setSlides(previous => [...previous.filter(row => row.id !== saved.id), saved].sort((a, b) => a.sort_order - b.sort_order || a.id.localeCompare(b.id)));
      setEditing(null);
    }} />}
    <div className="mt-6 space-y-4">{slides.length === 0 && <p>No slides. Add one to show a homepage hero.</p>}{slides.map(slide => <article key={slide.id} className="overflow-hidden border bg-white sm:flex">
      <FastImage src={slide.image_url} alt="" width={480} className="h-44 w-full object-cover sm:w-48" />
      <div className="min-w-0 flex-1 p-5"><p className="text-xs font-bold text-sky-600">Order {slide.sort_order} · {slide.is_published ? 'Published' : 'Draft'}</p><p className="mt-2 text-xs uppercase">{slide.subtitle}</p><h3 className="mt-1 font-black">{slide.title}</h3><p className="mt-2 text-sm text-slate-500">{slide.description}</p>
        {canEdit && <div className="mt-4 flex gap-3"><button disabled={Boolean(editing) || Boolean(deleting)} onClick={() => setEditing(slide)} className="border px-4 py-2 text-sm disabled:opacity-50">Edit slide</button><button disabled={Boolean(editing) || Boolean(deleting)} onClick={() => remove(slide)} className="border border-rose-200 px-4 py-2 text-sm text-rose-600 disabled:opacity-50">{deleting === slide.id ? 'Deleting…' : 'Delete slide'}</button></div>}
      </div>
    </article>)}</div>
  </div>;
}
