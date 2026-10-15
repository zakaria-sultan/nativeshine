export const DEFAULT_SETTINGS = {
  id: true,
  office_phone: '020 3642 1152',
  mobile_phone: '07777 143488',
  email: 'info@nativeshine.co.uk',
  address: '9 Roswick Albany street\nLondon nw1 4bj',
  office_hours: 'Mon - Fri: 08:00 - 18:00',
};

export function phoneHref(value = '') {
  return `tel:${value.replace(/[^+\d]/g, '')}`;
}

export function whatsappHref(value = '') {
  let digits = value.replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  else if (digits.startsWith('0')) digits = `44${digits.slice(1)}`;
  return `https://wa.me/${digits}`;
}

export function mapEmbedUrl(address) {
  return `https://www.google.com/maps?q=${encodeURIComponent(address.trim().replace(/\s+/g, ' '))}&output=embed`;
}

export function validateSettings(input) {
  const settings = Object.fromEntries(Object.keys(DEFAULT_SETTINGS)
    .filter(key => key !== 'id').map(key => [key, String(input[key] ?? '').trim()]));
  for (const key of ['office_phone', 'mobile_phone']) {
    if (!/^\+?[\d\s().-]{7,30}$/.test(settings[key]) || settings[key].replace(/\D/g, '').length < 7) {
      throw new Error('Enter valid office and mobile phone numbers. Use +country code for numbers outside the UK.');
    }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) throw new Error('Enter a valid enquiry email address.');
  if (!settings.address || settings.address.length > 500) throw new Error('Enter an address of up to 500 characters.');
  if (!settings.office_hours || settings.office_hours.length > 200) throw new Error('Enter office hours of up to 200 characters.');
  return settings;
}

export function validateSlide(input) {
  const slide = {
    title: String(input.title ?? '').trim(),
    subtitle: String(input.subtitle ?? '').trim(),
    description: String(input.description ?? '').trim(),
    image_url: String(input.image_url ?? '').trim(),
    sort_order: Number(input.sort_order),
    is_published: Boolean(input.is_published),
  };
  if (!slide.title || slide.title.length > 250) throw new Error('Enter a slide title of up to 250 characters.');
  if (slide.subtitle.length > 150 || slide.description.length > 2000) throw new Error('Slide subtitle or description is too long.');
  if (!Number.isInteger(slide.sort_order)) throw new Error('Slide order must be a whole number.');
  if (!/^https:\/\//.test(slide.image_url)) throw new Error('Upload an image or enter an HTTPS image URL.');
  return slide;
}
