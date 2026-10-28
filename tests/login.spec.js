import { test, expect } from '@playwright/test';
import { CUENTA, entrar, esperarVista, vista } from './ayudas';

test('protege las rutas y rechaza credenciales que no coinciden', async ({ page }) => {
  await page.goto('/contacts');
  await expect(page).toHaveURL(/\/login$/);

  await page.goto('/tasks');
  await expect(page).toHaveURL(/\/login$/);
  await esperarVista(page);

  await vista(page).getByPlaceholder('user@mail.com').fill(CUENTA.email);
  await vista(page).locator('input[type=password]').fill('incorrecta');
  await vista(page).getByRole('button', { name: 'Ingresar' }).click();
  await expect(vista(page).getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);
});

test('entra, recuerda la sesión al recargar y cierra sesión', async ({ page }) => {
  await entrar(page);
  await expect(vista(page).getByTestId('usuario')).toContainText(CUENTA.email);

  await page.reload();
  await expect(page).toHaveURL(/\/contacts$/);
  await esperarVista(page);
  await expect(vista(page).getByTestId('cerrar-sesion')).toBeVisible();

  await page.goto('/login');
  await expect(page).toHaveURL(/\/contacts$/);
  await esperarVista(page);

  await vista(page).getByTestId('cerrar-sesion').click();
  await expect(page).toHaveURL(/\/login$/);
  await esperarVista(page);
  await expect(vista(page).getByRole('button', { name: 'Ingresar' })).toBeVisible();

  await page.goto('/fruits');
  await expect(page).toHaveURL(/\/login$/);
});
