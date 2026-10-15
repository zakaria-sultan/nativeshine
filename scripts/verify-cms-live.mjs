/** Verify real Supabase persistence using temporary, unpublished fixtures only. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { loadEnv } from 'vite';
import { createClient } from '@supabase/supabase-js';
import { handleAdminUsers } from '../api/adminUsersCore.js';

const env = loadEnv('development', process.cwd(), '');
const options = { auth: { persistSession: false, autoRefreshToken: false } };
const admin = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, options);
const client = () => createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY, options);
const unwrap = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
const marker = randomUUID();
let userId, serviceId, slideId, managedUserId;
const uploaded = [];
const email = `cms-verification-${marker}@example.invalid`;
const password = `Test-${randomUUID()}!`;
const before = unwrap(await admin.from('service_testimonials').select('*').order('id'));
const settingsBefore = unwrap(await admin.from('site_settings').select('*').single());

try {
  const created = unwrap(await admin.auth.admin.createUser({ email, password, email_confirm: true, user_metadata: { full_name: 'Temporary CMS verification', role: 'super' } }));
  userId = created.user.id;
  const profile = unwrap(await admin.from('profiles').select('role').eq('id', userId).single());
  assert.equal(profile.role, 'user', 'Signup metadata must not grant super');
  unwrap(await admin.from('profiles').update({ role: 'admin' }).eq('id', userId).select().single());
  const editor = client();
  unwrap(await editor.auth.signInWithPassword({ email, password }));
  const service = unwrap(await editor.from('services').insert({ title: 'Temporary CMS persistence verification', slug: `cms-verification-${marker}`, is_published: false }).select().single());
  serviceId = service.id;
  const initial = unwrap(await editor.from('service_testimonials').insert({ service_id: serviceId, quote_text: 'Original temporary quote', client_name: 'Verification' }).select().single());
  const saved = unwrap(await editor.from('service_testimonials').update({ quote_text: 'Persisted temporary edit' }).eq('id', initial.id).eq('updated_at', initial.updated_at).select().single());
  const stale = await editor.from('service_testimonials').update({ quote_text: 'Stale overwrite must fail' }).eq('id', initial.id).eq('updated_at', initial.updated_at).select().single();
  assert.equal(stale.error?.code, 'PGRST116');
  unwrap(await editor.auth.refreshSession());
  const fresh = client();
  unwrap(await fresh.auth.signInWithPassword({ email, password }));
  assert.equal(unwrap(await fresh.from('service_testimonials').select('*').eq('id', saved.id).single()).quote_text, 'Persisted temporary edit');
  unwrap(await fresh.from('service_testimonials').delete().eq('id', saved.id).eq('updated_at', saved.updated_at).select().single());
  assert.deepEqual(unwrap(await client().from('service_testimonials').select('*').eq('service_id', serviceId)), []);
  assert.deepEqual(unwrap(await fresh.from('service_testimonials').select('*').eq('service_id', serviceId)), []);
  const slide = unwrap(await fresh.from('home_slides').insert({ title: 'Temporary unpublished verification slide', image_url: 'https://example.invalid/verification.jpg', is_published: false }).select().single());
  slideId = slide.id;
  unwrap(await fresh.from('home_slides').update({ title: 'Persisted slide edit' }).eq('id', slideId).eq('updated_at', slide.updated_at).select().single());
  assert.deepEqual(unwrap(await client().from('home_slides').select('*').eq('id', slideId)), []);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6dXQAAAAASUVORK5CYII=', 'base64');
  for (const bucket of ['service-images', 'site-images']) {
    const path = `verification/${marker}.png`;
    unwrap(await fresh.storage.from(bucket).upload(path, png, { contentType: 'image/png' }));
    uploaded.push({ bucket, path });
    unwrap(await fresh.storage.from(bucket).remove([path]));
  }
  const { data: { session } } = await editor.auth.getSession();
  const invoke = body => handleAdminUsers({ method: 'POST', body, authHeader: `Bearer ${session.access_token}`, env });
  assert.equal((await invoke({ action: 'list' })).status, 403, 'Content admins must not manage users');
  unwrap(await admin.from('profiles').update({ role: 'super' }).eq('id', userId).select().single());
  assert.equal((await invoke({ action: 'list' })).status, 200);
  const managed = await invoke({ action: 'create', email: `cms-managed-${marker}@example.invalid`, password, full_name: 'Temporary managed user', role: 'user' });
  assert.equal(managed.status, 200, managed.body.error);
  managedUserId = managed.body.user.id;
  assert.equal(unwrap(await admin.from('profiles').select('role').eq('id', managedUserId).single()).role, 'user');
  assert.equal((await invoke({ action: 'update', id: managedUserId, full_name: 'Updated managed user', role: 'admin' })).status, 200);
  assert.equal(unwrap(await admin.from('profiles').select('role').eq('id', managedUserId).single()).role, 'admin');
  assert.equal((await invoke({ action: 'update', id: userId, role: 'admin' })).status, 400);
  assert.equal((await invoke({ action: 'delete', id: userId })).status, 400);
  assert.equal((await invoke({ action: 'delete', id: managedUserId })).status, 200);
  managedUserId = null;
  console.log('PASS: shared user-management API checks roles, creates/updates/deletes users and protects own super access.');
  console.log('PASS: real admin login, signup role safety, testimonial create/edit/delete, stale-write rejection, token refresh, fresh-session persistence, draft visibility and both image buckets.');
} finally {
  for (const { bucket, path } of uploaded) {
    const result = await admin.storage.from(bucket).remove([path]);
    if (result.error) console.error('Temporary image cleanup failed:', result.error.message);
  }
  if (slideId) unwrap(await admin.from('home_slides').delete().eq('id', slideId));
  if (serviceId) unwrap(await admin.from('services').delete().eq('id', serviceId));
  if (managedUserId) unwrap(await admin.auth.admin.deleteUser(managedUserId));
  if (userId) unwrap(await admin.auth.admin.deleteUser(userId));
}
assert.deepEqual(unwrap(await admin.from('service_testimonials').select('*').order('id')), before, 'Existing testimonials must remain untouched');
assert.deepEqual(unwrap(await admin.from('site_settings').select('*').single()), settingsBefore, 'Existing contact settings must remain untouched');
console.log('PASS: temporary fixtures removed; existing testimonials and contact settings unchanged.');
