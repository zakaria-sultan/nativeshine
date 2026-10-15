import { test, expect } from '@playwright/test';
import { mockDatabase, login } from './fixture.js';

const quoteForm = page => page.locator('#testimonials form');

test('testimonial edit survives reload, auth refresh, and later public reads', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/services/service-one');
  await page.locator('#testimonials').getByRole('button', { name: 'Edit', exact: true }).click();
  await quoteForm(page).locator('textarea').fill('A permanently edited testimonial');
  await quoteForm(page).locator('input').first().fill('Updated client');
  await quoteForm(page).getByRole('button', { name: 'Update testimonial' }).click();
  await expect(page.getByRole('alert')).toContainText('Testimonial updated');
  expect(state.testimonials[0].quote_text).toBe('A permanently edited testimonial');
  await page.reload();
  await expect(page.locator('#testimonials')).toContainText('A permanently edited testimonial');
  await page.goto('/services/test-cleaning');
  await expect(page.getByText('"A permanently edited testimonial"', { exact: true })).toBeVisible();
  await page.clock.install();
  state.nowOffset = 3 * 60 * 60 * 1000;
  await page.clock.fastForward(65 * 60 * 1000);
  await page.bringToFront();
  await page.evaluate(() => {
    const key = 'sb-nativeshine-test-auth-token';
    const session = JSON.parse(localStorage.getItem(key));
    session.expires_at = 1;
    localStorage.setItem(key, JSON.stringify(session));
    window.dispatchEvent(new Event('focus'));
  });
  await expect.poll(() => state.refreshes).toBeGreaterThan(0);
  await expect(page.getByText('"A permanently edited testimonial"', { exact: true })).toBeVisible();
  await page.reload();
  await expect(page.getByText('"A permanently edited testimonial"', { exact: true })).toBeVisible();
  await expect(page.getByText('Hotel Services Client', { exact: true })).toHaveCount(0);
});

test('deleting the last testimonial and gallery image leaves them absent after reload', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  state.images.push({ id: 'gallery-one', service_id: 'service-one', kind: 'recent', slot: 1, url: 'https://images.test/gallery.jpg' });
  await login(page);
  await page.goto('/admin/services/service-one');
  await page.locator('#testimonials').getByRole('button', { name: 'Delete', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('#testimonials')).toContainText('No testimonials yet');
  await page.locator('#images').getByRole('button', { name: 'Remove', exact: true }).last().click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.locator('#images')).toContainText('No gallery images yet');
  await page.goto('/services/test-cleaning');
  await page.reload();
  await expect(page.getByText('TESTIMONIALS', { exact: true })).toHaveCount(0);
  await expect(page.getByText('OUR RECENT WORKS', { exact: true })).toHaveCount(0);
  expect(state.testimonials).toEqual([]);
});

test('database failure never replaces edited content with old static content', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  state.testimonials[0].quote_text = 'Live database edit';
  await page.goto('/services/test-cleaning');
  await expect(page.getByText('"Live database edit"', { exact: true })).toBeVisible();
  state.failReads = true;
  await page.bringToFront();
  await page.evaluate(() => window.dispatchEvent(new Event('focus')));
  await expect(page.getByRole('alert')).toContainText('could not be refreshed', { timeout: 15000 });
  await expect(page.getByText('"Live database edit"', { exact: true })).toBeVisible();
  await expect(page.getByText('Hotel Services Client', { exact: true })).toHaveCount(0);
  await page.reload();
  await expect(page.getByRole('alert').first()).toBeVisible({ timeout: 15000 });
  await expect(page.getByText('Hotel Services Client', { exact: true })).toHaveCount(0);
  state.failReads = false;
  await page.getByRole('button', { name: 'Try again' }).first().click();
  await expect(page.getByText('"Live database edit"', { exact: true })).toBeVisible();
});

test('contact save updates map, mobile header, WhatsApp, hours and enquiry recipient', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/settings');
  await page.getByLabel('Office phone', { exact: true }).fill('+252 61 111 2222');
  await page.getByLabel('Mobile / WhatsApp phone').fill('+252 61 333 4444');
  await page.getByLabel('Enquiry email').fill('new-office@example.com');
  await page.getByLabel('Office address').fill('2 Test & Co\nMogadishu, Somalia');
  await page.getByLabel('Office hours').fill('Sat - Thu: 09:00 - 17:00');
  await page.getByRole('button', { name: 'Save contact details' }).click();
  await expect(page.getByRole('alert')).toContainText('Contact details saved');
  await page.reload();
  await expect(page.getByLabel('Enquiry email')).toHaveValue('new-office@example.com');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/contact');
  await expect(page.locator('header a[href="tel:+252611112222"]')).toHaveText('+252 61 111 2222');
  await expect(page.locator('header a[href="tel:+252613334444"]')).toHaveText('+252 61 333 4444');
  await expect(page.locator('a[href="mailto:new-office@example.com"]')).toBeVisible();
  await expect(page.locator('footer a[title="WhatsApp"]')).toHaveAttribute('href', 'https://wa.me/252613334444');
  await expect(page.locator('footer')).toContainText('Sat - Thu: 09:00 - 17:00');
  const map = new URL(await page.locator('iframe').getAttribute('src'));
  expect(map.searchParams.get('q')).toBe('2 Test & Co Mogadishu, Somalia');
  const form = page.locator('form');
  await form.locator('input[type="text"]').fill('Test enquiry');
  await form.locator('input[type="email"]').fill('sender@example.com');
  await form.locator('select').selectOption({ label: 'Test cleaning' });
  await form.locator('textarea').fill('Testing the configured recipient');
  await form.getByRole('button', { name: /Send Message/ }).click();
  await expect(page.getByRole('alert')).toContainText('sent successfully');
  expect(state.enquiries[0].url).toContain('new-office%40example.com');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
});

test('homepage text, image, publishing, deletion and new slides persist', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/homepage');
  await page.getByRole('button', { name: 'Edit slide', exact: true }).first().click();
  await page.getByLabel('Title', { exact: true }).fill('MY UPDATED HERO');
  await page.getByLabel('Subtitle', { exact: true }).fill('NEW SUBTITLE');
  await page.getByLabel('Description', { exact: true }).fill('Description written by the client');
  await page.getByLabel('Image URL', { exact: true }).fill('https://images.test/new-hero.jpg');
  await page.getByRole('button', { name: 'Save slide', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Homepage slide saved' }).last()).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'MY UPDATED HERO' })).toBeVisible();
  await expect(page.locator('#top img')).toHaveAttribute('src', 'https://images.test/new-hero.jpg');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'MY UPDATED HERO' })).toBeVisible();
  await page.goto('/admin/homepage');
  await page.getByRole('button', { name: 'Edit slide', exact: true }).first().click();
  await page.getByLabel('Published on homepage').uncheck();
  await page.getByRole('button', { name: 'Save slide', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Homepage slide saved' }).last()).toBeVisible();
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'SECOND HERO TITLE' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'MY UPDATED HERO' })).toHaveCount(0);
  await page.goto('/admin/homepage');
  await page.getByRole('button', { name: 'Delete slide', exact: true }).first().click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Homepage slide deleted');
  expect(state.slides).toHaveLength(1);
  await page.getByRole('button', { name: 'Add slide', exact: true }).click();
  await page.getByLabel('Title', { exact: true }).fill('NEW CLIENT SLIDE');
  await page.getByLabel('Image URL', { exact: true }).fill('https://images.test/third.jpg');
  await page.getByRole('button', { name: 'Save slide', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Homepage slide saved' }).last()).toBeVisible();
  expect(state.slides).toHaveLength(2);
});

test('an already-open public tab refreshes when admin changes contact settings', async ({ page, context }) => {
  await mockDatabase(context);
  await login(page);
  const publicTab = await context.newPage();
  await publicTab.goto('/contact');
  await expect(publicTab.getByText('info@nativeshine.co.uk', { exact: true })).toBeVisible();
  await page.goto('/admin/settings');
  await page.getByLabel('Enquiry email').fill('shared@example.com');
  await page.getByRole('button', { name: 'Save contact details' }).click();
  await expect(page.getByRole('alert')).toContainText('Contact details saved');
  await publicTab.bringToFront();
  await expect(publicTab.getByText('shared@example.com', { exact: true })).toBeVisible();
});

test('empty published services and slides stay empty', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  state.services[0].is_published = false;
  state.slides.forEach(slide => { slide.is_published = false; });
  await page.goto('/');
  await expect(page.locator('#services')).toBeVisible();
  await expect(page.locator('#services a')).toHaveCount(0);
  await expect(page.locator('#top')).toHaveCount(0);
  await page.reload();
  await expect(page.locator('#services a')).toHaveCount(0);
});

test('read-only users cannot edit settings or homepage slides', async ({ page, context }) => {
  await mockDatabase(context, { role: 'user' });
  await login(page);
  await page.goto('/admin/settings');
  await expect(page.getByLabel('Enquiry email')).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save contact details' })).toHaveCount(0);
  await page.goto('/admin/homepage');
  await expect(page.getByRole('button', { name: 'Add slide' })).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Edit slide', exact: true })).toHaveCount(0);
});

test('stale and denied saves do not claim success or overwrite newer database edits', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/settings');
  await expect(page.getByLabel('Enquiry email')).toHaveValue('info@nativeshine.co.uk');
  state.settings[0].email = 'newer-editor@example.com';
  state.settings[0].updated_at = '2026-10-16T00:00:00Z';
  await page.getByLabel('Enquiry email').fill('stale-editor@example.com');
  await page.getByRole('button', { name: 'Save contact details' }).click();
  await expect(page.getByRole('alert')).toContainText('Reload this page');
  expect(state.settings[0].email).toBe('newer-editor@example.com');
  await page.reload();
  await expect(page.getByLabel('Enquiry email')).toHaveValue('newer-editor@example.com');
  state.denied = true;
  await page.getByLabel('Enquiry email').fill('denied-editor@example.com');
  await page.getByRole('button', { name: 'Save contact details' }).click();
  await expect(page.getByRole('alert')).toContainText('Permission denied');
  expect(state.settings[0].email).toBe('newer-editor@example.com');
});

test('quote modal sends to the configured email without sending real mail', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  state.settings[0].email = 'quotes@example.com';
  await page.goto('/');
  await page.getByRole('button', { name: 'Get a Quote', exact: true }).click();
  const form = page.locator('form');
  await form.locator('input[type="text"]').fill('Quote sender');
  await form.locator('input[type="email"]').fill('sender@example.com');
  await form.locator('input[type="tel"]').fill('07777143488');
  await form.locator('select').selectOption({ label: 'Test cleaning' });
  await form.locator('textarea').fill('Quote details');
  await form.locator('button[type="submit"]').click();
  await expect(page.getByRole('alert')).toContainText('sent successfully');
  expect(state.enquiries[0].url).toContain('quotes%40example.com');
});

test('homepage image upload saves its storage URL and survives reload', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/homepage');
  await page.getByRole('button', { name: 'Edit slide', exact: true }).first().click();
  await page.getByLabel('Or upload a background image').setInputFiles({
    name: 'new-background.png', mimeType: 'image/png',
    buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wl6dXQAAAAASUVORK5CYII=', 'base64'),
  });
  await page.getByRole('button', { name: 'Save slide', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Homepage slide saved');
  expect(state.slides[0].image_url).toContain('/storage/v1/object/public/site-images/slides/');
  expect(state.slides[0].storage_path).toContain('slides/');
  expect(state.uploads.length).toBeGreaterThan(0);
  await page.goto('/');
  await expect(page.locator('#top img')).toHaveAttribute('src', /site-images\/slides\//);
  await page.reload();
  await expect(page.locator('#top img')).toHaveAttribute('src', /site-images\/slides\//);
});

test('a stale testimonial editor cannot overwrite a newer saved quote', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/services/service-one');
  await page.locator('#testimonials').getByRole('button', { name: 'Edit', exact: true }).click();
  state.testimonials[0].quote_text = 'Newer database edit';
  state.testimonials[0].updated_at = '2026-10-16T00:00:00Z';
  await quoteForm(page).locator('textarea').fill('Stale editor text');
  await quoteForm(page).getByRole('button', { name: 'Update testimonial' }).click();
  await expect(page.getByRole('alert')).toContainText('Reload this page');
  expect(state.testimonials[0].quote_text).toBe('Newer database edit');
});
