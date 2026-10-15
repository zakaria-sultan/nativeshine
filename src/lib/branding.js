export const BRANDING_DEFAULTS = {
  logo_url: '/logo.jpeg',
  logo_storage_path: null,
  wordmark_url: null,
  wordmark_storage_path: null,
};

export function validateBrandImage(file) {
  if (!['image/png', 'image/jpeg', 'image/webp'].includes(file?.type)) {
    throw new Error('Choose a PNG, JPG or WebP image.');
  }
  if (!file.size || file.size > 5 * 1024 * 1024) {
    throw new Error('Choose an image smaller than 5 MB.');
  }
}
