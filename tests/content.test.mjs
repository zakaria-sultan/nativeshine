import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mapServiceRow, fetchServicesFromSupabase } from '../src/lib/servicesApi.js';
import { DEFAULT_SETTINGS, mapEmbedUrl, phoneHref, whatsappHref, validateSettings, validateSlide } from '../src/lib/siteContent.js';
import { submitEnquiryEmail } from '../src/lib/submitEnquiryEmail.js';

test('database testimonial edits and empty lists never acquire static defaults', () => {
  const row = { id: 'service', slug: 'service', title: 'Service' };
  const edited = [{ id: 'quote', quote_text: 'Changed permanently', client_name: 'Client', initials: 'C' }];
  assert.equal(mapServiceRow(row, [], edited).testimonials[0].text, 'Changed permanently');
  assert.deepEqual(mapServiceRow(row, [], []).testimonials, []);
  assert.deepEqual(mapServiceRow(row, [], []).recentImages, []);
});

test('no published services stays empty and database errors propagate', async () => {
  const query = { select() { return this; }, order() { return this; }, eq() { return Promise.resolve({ data: [], error: null }); } };
  assert.deepEqual(await fetchServicesFromSupabase({ from: () => query }), []);
  query.eq = () => Promise.resolve({ error: new Error('offline') });
  await assert.rejects(fetchServicesFromSupabase({ from: () => query }), /offline/);
});

test('one address drives maps, including punctuation and non-UK addresses', () => {
  const address = '2 Test & Co\nMogadishu, Somalia';
  assert.equal(new URL(mapEmbedUrl(address)).searchParams.get('q'), '2 Test & Co Mogadishu, Somalia');
  assert.equal(whatsappHref('07777 143488'), 'https://wa.me/447777143488');
  assert.equal(whatsappHref('+252 61 123 4567'), 'https://wa.me/252611234567');
  assert.equal(whatsappHref('00252 61 123 4567'), 'https://wa.me/252611234567');
  assert.equal(phoneHref('+252 61 123 4567'), 'tel:+252611234567');
});

test('settings and slide validation reject invalid content before writes', () => {
  assert.equal(validateSettings(DEFAULT_SETTINGS).email, DEFAULT_SETTINGS.email);
  assert.throws(() => validateSettings({ ...DEFAULT_SETTINGS, email: 'broken' }), /email/);
  assert.throws(() => validateSettings({ ...DEFAULT_SETTINGS, mobile_phone: '---' }), /phone/);
  assert.throws(() => validateSettings({ ...DEFAULT_SETTINGS, address: ' ' }), /address/);
  assert.throws(() => validateSlide({ title: 'Valid', image_url: 'javascript:alert(1)', sort_order: 0 }), /HTTPS/);
});

test('enquiries use saved email and never report an unconfirmed submission as success', async () => {
  const original = globalThis.fetch;
  let endpoint;
  try {
    globalThis.fetch = async url => { endpoint = url; return { ok: true, json: async () => ({ success: 'true' }) }; };
    await submitEnquiryEmail({ name: 'Test' }, { recipient: 'updated@example.com' });
    assert.equal(endpoint, 'https://formsubmit.co/ajax/updated%40example.com');
    globalThis.fetch = async () => ({ ok: true, json: async () => ({ success: 'false', message: 'Not active' }) });
    await assert.rejects(submitEnquiryEmail({}, { recipient: 'updated@example.com' }), /Not active/);
    globalThis.fetch = async () => ({ ok: true, json: async () => ({}) });
    await assert.rejects(submitEnquiryEmail({}, { recipient: 'updated@example.com' }), /did not confirm/);
    await assert.rejects(submitEnquiryEmail({}), /unavailable/);
  } finally { globalThis.fetch = original; }
});

test('admin API rejects unsupported methods and missing authorization', async () => {
  const { handleAdminUsers } = await import('../api/adminUsersCore.js');
  assert.equal((await handleAdminUsers({ method: 'DELETE', env: {} })).status, 405);
  assert.equal((await handleAdminUsers({ method: 'POST', env: {} })).status, 500);
  assert.equal((await handleAdminUsers({ method: 'POST', env: { SUPABASE_URL: 'https://example.supabase.co', SUPABASE_ANON_KEY: 'anon', SUPABASE_SERVICE_ROLE_KEY: 'service' } })).status, 401);
});
