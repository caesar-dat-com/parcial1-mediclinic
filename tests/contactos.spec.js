import { test, expect } from '@playwright/test';

test('carga los contactos y permite agregar y eliminar', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('Cargando contactos...')).toBeVisible();
  await expect(page.locator('li')).toHaveCount(3);
  await page.getByRole('button', { name: 'Agregar', exact: true }).click();
  await expect(page.getByText('Escribe el nombre y el telefono')).toBeVisible();
  await page.getByPlaceholder('Nombre', { exact: true }).fill('Prueba de clase');
  await page.getByPlaceholder('Telefono', { exact: true }).fill('3001234567');
  await page.getByRole('button', { name: 'Agregar', exact: true }).click();
  await expect(page.locator('li')).toHaveCount(4);
  await page.locator('li').filter({ hasText: 'Prueba de clase' }).getByRole('button').click();
  await expect(page.locator('li')).toHaveCount(3);
  for (let i = 0; i < 3; i++) await page.getByRole('button', { name: 'Eliminar' }).first().click();
  await expect(page.getByText('No hay contactos todavia.')).toBeVisible();
});
