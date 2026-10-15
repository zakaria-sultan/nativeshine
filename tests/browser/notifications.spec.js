import { test, expect } from '@playwright/test';
import { mockDatabase, login } from './fixture.js';

test('delete confirmation supports Cancel, Escape, focus restoration and mobile layout', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await page.setViewportSize({ width: 320, height: 740 });
  await login(page);
  await page.goto('/admin/homepage');
  const trigger = page.getByRole('button', { name: 'Delete slide', exact: true }).first();
  const dialog = page.getByRole('alertdialog');
  await trigger.click();
  await expect(dialog).toContainText('cannot be undone');
  await expect(dialog.getByRole('button', { name: 'Cancel' })).toBeFocused();
  const box = await dialog.boundingBox();
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(320);
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  await expect(trigger).toBeFocused();
  expect(state.slides).toHaveLength(2);
  await trigger.click();
  await dialog.getByRole('button', { name: 'Cancel' }).click();
  expect(state.slides).toHaveLength(2);
  await trigger.click();
  await dialog.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Homepage slide deleted');
  expect(state.slides).toHaveLength(1);
});

test('failed deletion shows an error, preserves the service and permits retry', async ({ page, context }) => {
  const { state } = await mockDatabase(context);
  await login(page);
  await page.goto('/admin/services');
  state.denied = true;
  await page.getByRole('button', { name: 'Delete Test cleaning', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Permission denied');
  expect(state.services).toHaveLength(1);
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
  state.denied = false;
  await page.getByRole('button', { name: 'Delete Test cleaning', exact: true }).click();
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Deleted “Test cleaning”');
  await expect(page.getByText('No services yet. Create a service to get started.')).toBeVisible();
  expect(state.services).toHaveLength(0);
});

test('notifications expire independently and remain dismissible', async ({ page, context }) => {
  await mockDatabase(context);
  await login(page);
  await page.goto('/admin/homepage');
  const removeFirst = async () => {
    await page.getByRole('button', { name: 'Delete slide', exact: true }).first().click();
    await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  };
  await removeFirst();
  await expect(page.getByRole('alert')).toHaveCount(1);
  const first = page.getByRole('alert').first();
  const firstId = await first.getAttribute('data-toast-id');
  // Real elapsed time also exercises Framer Motion's animation clock.
  await page.waitForTimeout(3000);
  await removeFirst();
  await expect(page.getByRole('alert')).toHaveCount(2);
  await expect(page.locator(`[data-toast-id="${firstId}"]`)).toHaveCount(0, { timeout: 3000 });
  await expect(page.getByRole('alert')).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss notification' }).click();
  await expect(page.getByRole('alert')).toHaveCount(0);
});

test('sign out reports success and returns to login', async ({ page, context }) => {
  await mockDatabase(context);
  await login(page);
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole('alert')).toContainText('Signed out successfully');
});

test('super admin user deletion confirms the account and avoids duplicate requests', async ({ page, context }) => {
  await mockDatabase(context, { role: 'super' });
  let users = [{ id: 'other-user', email: 'other@example.com', full_name: 'Other editor', role: 'admin' }];
  let deletes = 0;
  let release;
  const pendingDelete = new Promise(resolve => { release = resolve; });
  await context.route('**/api/admin-users', async route => {
    const body = route.request().postDataJSON();
    if (body.action === 'list') return route.fulfill({ json: { users } });
    if (body.action === 'delete') {
      deletes++;
      await pendingDelete;
      users = [];
      return route.fulfill({ json: { success: true } });
    }
    return route.fulfill({ status: 400, json: { error: 'Unexpected action' } });
  });
  await login(page);
  await page.goto('/admin/users');
  await page.getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('alertdialog')).toContainText('other@example.com');
  await page.getByRole('alertdialog').getByRole('button', { name: 'Delete', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Delete', exact: true })).toBeDisabled();
  expect(deletes).toBe(1);
  release();
  await expect(page.getByRole('alert')).toContainText('User deleted');
  await expect(page.getByText('other@example.com', { exact: true })).toHaveCount(0);
});
