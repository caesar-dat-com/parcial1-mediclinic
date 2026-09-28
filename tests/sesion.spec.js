import { test, expect } from '@playwright/test';

test('protege List, recuerda la sesión y permite salir', async ({ page }) => {
  await page.goto('/list');
  await expect(page).toHaveURL(/\/login$/);
  await page.getByPlaceholder('user@mail.com').fill('user@mail.com');
  await page.locator('input[type=password]').fill('incorrecta');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
  await page.locator('input[type=password]').fill('123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/list$/);
  expect(await page.evaluate(() => localStorage.getItem('logged'))).toBe('true');
  await page.reload();
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
  await page.goto('/login');
  await expect(page).toHaveURL(/\/list$/);
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);
  expect(await page.evaluate(() => localStorage.getItem('logged'))).toBeNull();
  await page.goto('/list');
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
});
