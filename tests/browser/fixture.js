import { randomUUID } from 'node:crypto';

export async function mockDatabase(context, { role = 'admin' } = {}) {
  const uid = '10000000-0000-0000-0000-000000000001';
  let stamp = 0;
  const timestamp = () => new Date(Date.UTC(2026, 9, 15, 12, 0, ++stamp)).toISOString();
  const state = {
    failReads: false,
    refreshes: 0,
    denied: false,
    settings: [{ id: true, office_phone: '020 3642 1152', mobile_phone: '07777 143488', email: 'info@nativeshine.co.uk', address: '9 Roswick Albany street\nLondon nw1 4bj', office_hours: 'Mon - Fri: 08:00 - 18:00', updated_at: timestamp() }],
    slides: [{ id: 'slide-one', title: 'ORIGINAL HERO TITLE', subtitle: 'ORIGINAL SUBTITLE', description: 'Original description', image_url: 'https://images.test/hero-one.jpg', storage_path: null, sort_order: 1, is_published: true, updated_at: timestamp() }, { id: 'slide-two', title: 'SECOND HERO TITLE', subtitle: 'SECOND SUBTITLE', description: 'Second description', image_url: 'https://images.test/hero-two.jpg', storage_path: null, sort_order: 2, is_published: true, updated_at: timestamp() }],
    services: [{ id: 'service-one', title: 'Test cleaning', slug: 'test-cleaning', content: 'Service description', sort_order: 1, is_published: true, updated_at: timestamp() }],
    testimonials: [{ id: 'quote-one', service_id: 'service-one', quote_text: 'Original database testimonial', client_name: 'Original client', initials: 'OC', sort_order: 0, updated_at: timestamp() }],
    images: [{ id: 'image-one', service_id: 'service-one', kind: 'hero', slot: 1, url: 'https://images.test/service.jpg' }],
    enquiries: [],
    uploads: [],
  };
  const user = { id: uid, email: 'editor@example.com', role: 'authenticated', aud: 'authenticated', app_metadata: {}, user_metadata: {} };
  const token = () => `${Buffer.from('{}').toString('base64url')}.${Buffer.from(JSON.stringify({ sub: uid, role: 'authenticated', exp: Math.floor((Date.now() + (state.nowOffset || 0)) / 1000) + 3600 })).toString('base64url')}.test`;
  const session = () => ({ access_token: token(), refresh_token: 'test-refresh', token_type: 'bearer', expires_in: 3600, expires_at: Math.floor((Date.now() + (state.nowOffset || 0)) / 1000) + 3600, user });
  await context.route('https://images.test/**', route => route.fulfill({ contentType: 'image/svg+xml', body: '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#1677aa"/></svg>' }));
  await context.route('https://www.google.com/**', route => route.fulfill({ body: '<html>Map preview</html>', contentType: 'text/html' }));
  await context.route('https://fonts.googleapis.com/**', route => route.fulfill({ body: '', contentType: 'text/css' }));
  await context.route('https://formsubmit.co/**', async route => {
    state.enquiries.push({ url: route.request().url(), body: route.request().postDataJSON() });
    await route.fulfill({ json: { success: 'true' } });
  });
  await context.route('https://nativeshine-test.supabase.co/**', async route => {
    const request = route.request();
    const url = new URL(request.url());
    if (url.pathname.includes('/auth/v1/token')) {
      if (url.searchParams.get('grant_type') === 'refresh_token') state.refreshes++;
      return route.fulfill({ json: session() });
    }
    if (url.pathname.includes('/auth/v1/user')) return route.fulfill({ json: user });
    if (url.pathname.includes('/auth/v1/logout')) return route.fulfill({ json: {} });
    if (url.pathname.includes('/storage/')) {
      if (request.method() === 'POST') state.uploads.push(url.pathname);
      return route.fulfill({ json: { Key: 'test-upload', path: 'test-upload' } });
    }
    const name = url.pathname.split('/').pop();
    const key = { site_settings: 'settings', home_slides: 'slides', services: 'services', service_images: 'images', service_testimonials: 'testimonials' }[name];
    if (name === 'profiles') return route.fulfill({ json: { id: uid, email: user.email, full_name: 'Test editor', role, created_at: timestamp() } });
    if (!key) return route.fulfill({ status: 404, json: { message: `Unknown fixture route ${name}` } });
    const isRead = request.method() === 'GET';
    if (isRead && state.failReads) return route.fulfill({ status: 503, json: { message: 'Temporary database failure' } });
    if (!isRead && (state.denied || role === 'user')) return route.fulfill({ status: 403, json: { message: 'Permission denied' } });
    const matches = row => [...url.searchParams].every(([field, value]) => {
      if (!value.startsWith('eq.')) return true;
      return String(row[field]) === value.slice(3);
    });
    let rows;
    if (request.method() === 'POST') {
      const row = { id: randomUUID(), ...request.postDataJSON(), updated_at: timestamp() };
      state[key].push(row); rows = [row];
    } else if (request.method() === 'PATCH') {
      rows = state[key].filter(matches);
      rows.forEach(row => Object.assign(row, request.postDataJSON(), { updated_at: timestamp() }));
    } else if (request.method() === 'DELETE') {
      rows = state[key].filter(matches);
      state[key] = state[key].filter(row => !matches(row));
    } else rows = state[key].filter(matches);
    rows = structuredClone(rows);
    if (name === 'services') rows.forEach(row => {
      row.service_images = state.images.filter(image => image.service_id === row.id);
      row.service_testimonials = state.testimonials.filter(quote => quote.service_id === row.id);
    });
    const single = request.headers().accept?.includes('application/vnd.pgrst.object+json');
    if (single && rows.length !== 1) return route.fulfill({ status: 406, json: { code: 'PGRST116', message: 'Cannot coerce to a single JSON object' } });
    await route.fulfill({ json: single ? rows[0] : rows, headers: { 'cache-control': 'no-store' } });
  });
  return { state, session };
}

export async function login(page) {
  await page.goto('/admin/login');
  await page.getByLabel('Email', { exact: true }).fill('editor@example.com');
  await page.getByLabel('Password', { exact: true }).fill('test-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.waitForURL('**/admin');
}
