import { validateSettings, validateSlide } from './siteContent';

export async function fetchSiteContent(client, { includeUnpublished = false } = {}) {
  let slidesQuery = client.from('home_slides').select('*').order('sort_order').order('id');
  if (!includeUnpublished) slidesQuery = slidesQuery.eq('is_published', true);
  const [settings, slides] = await Promise.all([
    client.from('site_settings').select('*').eq('id', true).single(),
    slidesQuery,
  ]);
  if (settings.error) throw settings.error;
  if (slides.error) throw slides.error;
  return { settings: settings.data, slides: slides.data ?? [] };
}

export async function saveSiteSettings(client, input) {
  let query = client.from('site_settings').update(validateSettings(input)).eq('id', true);
  if (input.updated_at) query = query.eq('updated_at', input.updated_at);
  const { data, error } = await query.select().single();
  if (error) throw error;
  return data;
}

export async function saveHomeSlide(client, input, file) {
  let uploadedPath = null;
  try {
    const rowInput = { ...input };
    if (file) {
      const { compressImageForUpload } = await import('./imageUpload');
      const compressed = await compressImageForUpload(file);
      uploadedPath = `slides/${crypto.randomUUID()}.${compressed.type === 'image/png' ? 'png' : compressed.type === 'image/webp' ? 'webp' : 'jpg'}`;
      const { error } = await client.storage.from('site-images').upload(uploadedPath, compressed, {
        contentType: compressed.type, cacheControl: '31536000',
      });
      if (error) throw error;
      rowInput.image_url = client.storage.from('site-images').getPublicUrl(uploadedPath).data.publicUrl;
    }
    const row = { ...validateSlide(rowInput), storage_path: uploadedPath ||
      (input.image_url === input.original_image_url ? input.storage_path : null) };
    let query = input.id
      ? client.from('home_slides').update(row).eq('id', input.id)
      : client.from('home_slides').insert(row);
    if (input.id && input.updated_at) query = query.eq('updated_at', input.updated_at);
    const { data, error } = await query.select().single();
    if (error) throw error;
    if (input.storage_path && input.storage_path !== data.storage_path) {
      const cleanup = await client.storage.from('site-images').remove([input.storage_path]);
      if (cleanup.error) console.warn('Slide saved; old image cleanup failed', cleanup.error);
    }
    return data;
  } catch (error) {
    if (uploadedPath) await client.storage.from('site-images').remove([uploadedPath]);
    throw error;
  }
}

export async function deleteHomeSlide(client, slide) {
  let query = client.from('home_slides').delete().eq('id', slide.id);
  if (slide.updated_at) query = query.eq('updated_at', slide.updated_at);
  const { error } = await query.select('id').single();
  if (error) throw error;
  if (slide.storage_path) {
    const cleanup = await client.storage.from('site-images').remove([slide.storage_path]);
    if (cleanup.error) console.warn('Slide deleted; image cleanup failed', cleanup.error);
  }
}

export function contentSaveError(error) {
  return error?.code === 'PGRST116'
    ? 'This content changed or is no longer available. Reload this page before editing again.'
    : error?.message || 'Could not save changes.';
}
