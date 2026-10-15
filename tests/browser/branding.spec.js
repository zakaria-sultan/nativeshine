import { test, expect } from '@playwright/test';
import { mockDatabase, login } from './fixture.js';

async function transparentLogo(page, width = 64, height = 64) {
  const encoded = await page.evaluate(({ width, height }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width; canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0ea5e9';
    ctx.fillRect(8, 8, width - 16, height - 16);
    return canvas.toDataURL('image/png').split(',')[1];
  }, { width, height });
  return { name: 'company.png', mimeType: 'image/png', buffer: Buffer.from(encoded, 'base64') };
}

async function assertLogoEverywhere(page, logoUrl, wordmarkUrl) {
  await expect(page.locator('header .ns-header-brand img').first()).toHaveAttribute('src', logoUrl);
  await expect(page.locator('footer a[href="/"] img').first()).toHaveAttribute('src', logoUrl);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', logoUrl);
  if (wordmarkUrl) await expect(page.locator('header .ns-header-brand .ns-uploaded-wordmark')).toHaveAttribute('src', wordmarkUrl);
  await page.setViewportSize({ width: 320, height: 740 });
  await page.getByRole('button', { name: 'Open menu', exact: true }).click();
  const drawer = page.locator('div.fixed').filter({ has: page.getByRole('button', { name: 'Close menu', exact: true }) }).last();
  await expect(drawer.locator('img').first()).toHaveAttribute('src', logoUrl);
  if (wordmarkUrl) await expect(page.locator('.ns-menu-wordmark')).toHaveAttribute('src', wordmarkUrl);
  const brand = await page.locator('header .ns-header-brand').boundingBox();
  const menu = await page.getByRole('button', { name: 'Open menu', exact: true }).boundingBox();
  expect(brand.x + brand.width).toBeLessThanOrEqual(menu.x);
  if (wordmarkUrl) {
    const image = await page.locator('header .ns-uploaded-wordmark').boundingBox();
    expect(image.height).toBeLessThan(80);
  }
  await page.getByRole('button', { name: 'Close menu', exact: true }).click();
}

test('client replaces icon and wordmark losslessly; shared branding persists across tabs and reload', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  const publicTab = await context.newPage();
  await publicTab.goto('/');
  await page.goto('/admin/branding');
  await expect(page.getByRole('heading', { name: 'Company logo & branding' })).toBeVisible();
  const icon = await transparentLogo(page);
  const wordmark = await transparentLogo(page, 800, 180);
  await page.getByLabel('Upload company icon', { exact: true }).setInputFiles(icon);
  await page.getByLabel('Upload company wordmark', { exact: true }).setInputFiles(wordmark);
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert')).toContainText('Company branding saved');
  const { logo_url: logo, wordmark_url: word, logo_storage_path: path } = state.settings[0];
  expect(logo).toContain('/site-images/branding/logo-');
  expect(word).toContain('/site-images/branding/wordmark-');
  expect(path).toMatch(/\.png$/);
  expect(state.uploadBodies.some(body => body?.includes(icon.buffer))).toBe(true);
  await publicTab.bringToFront();
  await expect(publicTab.locator('header .ns-header-brand img').first()).toHaveAttribute('src', logo);
  await publicTab.reload();
  await assertLogoEverywhere(publicTab, logo, word);
  expect(state.settings[0].email).toBe('info@nativeshine.co.uk');
  await page.reload();
  await expect(page.getByAltText('Company icon preview')).toHaveAttribute('src', logo);
});

test('restore originals persists and removes only old uploaded branding files', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  state.settings[0].logo_url = 'https://nativeshine-test.supabase.co/storage/v1/object/public/site-images/branding/old-logo.png';
  state.settings[0].logo_storage_path = 'branding/old-logo.png';
  state.settings[0].wordmark_url = 'https://nativeshine-test.supabase.co/storage/v1/object/public/site-images/branding/old-wordmark.png';
  state.settings[0].wordmark_storage_path = 'branding/old-wordmark.png';
  await login(page);
  await page.goto('/admin/branding');
  await page.getByRole('button', { name: 'Restore original logo', exact: true }).click();
  await page.getByRole('button', { name: 'Restore original wordmark', exact: true }).click();
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert')).toContainText('Company branding saved');
  expect(state.settings[0].logo_url).toBe('/logo.jpeg');
  expect(state.settings[0].wordmark_url).toBeNull();
  expect(state.removedFiles).toEqual(expect.arrayContaining(['branding/old-logo.png', 'branding/old-wordmark.png']));
  await page.goto('/');
  await page.reload();
  await expect(page.locator('header svg.ns-wordmark')).toBeVisible();
  await expect(page.locator('header .ns-header-brand img').first()).toHaveAttribute('src', '/logo.jpeg');
});

test('failed or stale save keeps existing branding and cleans staged uploads', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/branding');
  await page.getByLabel('Upload company icon', { exact: true }).setInputFiles(await transparentLogo(page));
  state.failBrandSave = true;
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert')).toContainText('Branding save denied');
  expect(state.settings[0].logo_url).toBe('/logo.jpeg');
  expect(state.removedFiles.some(path => path.startsWith('branding/logo-'))).toBe(true);
  state.failBrandSave = false;
  state.settings[0].updated_at = '2026-10-17T00:00:00Z';
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Reload this page' })).toBeVisible();
  expect(state.settings[0].logo_url).toBe('/logo.jpeg');
});

test('lost response after a committed save never deletes the active logo', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/branding');
  await page.getByLabel('Upload company icon', { exact: true }).setInputFiles(await transparentLogo(page));
  state.loseSaveResponse = true;
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert')).toContainText('Response lost after commit');
  expect(state.settings[0].logo_url).toContain('/branding/logo-');
  expect(state.removedFiles).not.toContain(state.settings[0].logo_storage_path);
  await page.reload();
  await expect(page.getByAltText('Company icon preview')).toHaveAttribute('src', state.settings[0].logo_url);
});

test('read-only users cannot upload or restore company branding', async ({ page, context }) => {
  await mockDatabase(context, { role: 'user' });
  await login(page);
  await page.goto('/admin/branding');
  await expect(page.getByLabel('Upload company icon', { exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Restore original logo', exact: true })).toBeDisabled();
  await expect(page.getByRole('button', { name: 'Save company branding' })).toHaveCount(0);
});

test('invalid image is rejected before upload', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/branding');
  await page.getByLabel('Upload company icon', { exact: true }).setInputFiles({ name: 'broken.png', mimeType: 'image/png', buffer: Buffer.from('not an image') });
  await page.getByRole('button', { name: 'Save company branding' }).click();
  await expect(page.getByRole('alert')).toContainText('could not be opened');
  expect(state.uploads).toHaveLength(0);
  expect(state.settings[0].logo_url).toBe('/logo.jpeg');
});
