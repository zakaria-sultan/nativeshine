import { BRANDING_DEFAULTS, validateBrandImage } from './branding.js';

async function verifyImage(file) {
  validateBrandImage(file);
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Invalid image');
  } catch {
    throw new Error('This image could not be opened. Choose another PNG, JPG or WebP file.');
  } finally { URL.revokeObjectURL(url); }
}

async function removeFiles(client, paths) {
  if (!paths.length) return;
  try {
    const urls = paths.map(path => client.storage.from('site-images').getPublicUrl(path).data.publicUrl);
    const [settings, slides, images] = await Promise.all([
      client.from('site_settings').select('logo_url,wordmark_url').eq('id', true).single(),
      client.from('home_slides').select('image_url').in('image_url', urls),
      client.from('service_images').select('url').in('url', urls),
    ]);
    if (settings.error || slides.error || images.error) {
      console.warn('Branding cleanup postponed: remaining references could not be checked');
      return;
    }
    const used = new Set([settings.data.logo_url, settings.data.wordmark_url,
      ...slides.data.map(slide => slide.image_url), ...images.data.map(image => image.url)]);
    const unused = paths.filter((path, index) => !used.has(urls[index]));
    if (!unused.length) return;
    const { error } = await client.storage.from('site-images').remove(unused);
    if (error) console.warn('Branding file cleanup failed', error);
  } catch (error) { console.warn('Branding file cleanup failed', error); }
}

export async function saveCompanyBranding(client, current, changes) {
  // Changes contain only the branding fields, so contact settings cannot be overwritten.
  const patch = {};
  const uploaded = [];
  try {
    // Decode both files before uploading either. Keep PNG/WebP transparency and
    // the original file quality: logos must not go through JPEG photo compression.
    for (const slot of ['logo', 'wordmark']) {
      if (changes[slot]?.file) await verifyImage(changes[slot].file);
    }
    for (const slot of ['logo', 'wordmark']) {
      const change = changes[slot];
      if (change?.file) {
        const file = change.file;
        const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type];
        const path = `branding/${slot}-${crypto.randomUUID()}.${ext}`;
        uploaded.push(path);
        const { error } = await client.storage.from('site-images').upload(path, file, {
          contentType: file.type, cacheControl: '31536000', upsert: false,
        });
        if (error) throw error;
        patch[`${slot}_url`] = client.storage.from('site-images').getPublicUrl(path).data.publicUrl;
        patch[`${slot}_storage_path`] = path;
      } else if (change?.reset) {
        patch[`${slot}_url`] = BRANDING_DEFAULTS[`${slot}_url`];
        patch[`${slot}_storage_path`] = null;
      }
    }
    if (!Object.keys(patch).length) throw new Error('Choose a new image or restore a default before saving.');
    let query = client.from('site_settings').update(patch).eq('id', true);
    if (current.updated_at) query = query.eq('updated_at', current.updated_at);
    const { data, error } = await query.select().single();
    if (error) throw error;
    // Remove only files owned by branding that are no longer referenced by any
    // settings slot. Keep shared photos and all built-in defaults intact.
    const retained = new Set([data.logo_storage_path, data.wordmark_storage_path]);
    const old = ['logo', 'wordmark'].map(slot => current[`${slot}_storage_path`])
      .filter(path => path?.startsWith('branding/') && !retained.has(path));
    await removeFiles(client, [...new Set(old)]);
    return data;
  } catch (error) {
    await removeFiles(client, uploaded);
    throw error;
  }
}
