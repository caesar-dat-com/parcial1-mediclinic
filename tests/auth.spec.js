import { test, expect } from '@playwright/test';
import { CLAVE, correoNuevo, entrar, registrarse } from './ayudas';

test('registra una cuenta nueva y entra directo a la lista de tareas', async ({ page }) => {
  const { email } = await registrarse(page);
  await expect(page.getByRole('heading', { name: 'Una cosa a la vez' })).toBeVisible();
  await expect(page.getByTestId('correo-sesion')).toContainText(email);
  await expect(page.getByRole('button', { name: 'Cerrar sesión' })).toBeVisible();
});

test('avisa cuando las contraseñas del registro no coinciden', async ({ page }) => {
  await page.goto('/register');
  await page.getByPlaceholder('tucorreo@mail.com').fill(correoNuevo('revisa'));
  await page.getByPlaceholder('Mínimo 6 caracteres').fill('secreta123');
  await page.getByPlaceholder('Repite la contraseña').fill('otracosa');
  await page.getByRole('button', { name: 'Registrarme' }).click();
  await expect(page.getByRole('alert')).toHaveText('Las contraseñas no coinciden.');
  await expect(page).toHaveURL(/\/register$/);
});

test('rechaza el login cuando la contraseña no coincide y lo acepta cuando sí', async ({ page }) => {
  const { email } = await registrarse(page);
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);

  await entrar(page, email, 'equivocada');
  await expect(page.getByRole('alert')).toBeVisible();
  await expect(page).toHaveURL(/\/login$/);

  await page.getByPlaceholder('Tu contraseña').fill(CLAVE);
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByTestId('correo-sesion')).toContainText(email);
});

test('mantiene la sesión al recargar la app', async ({ page }) => {
  const { email } = await registrarse(page);
  await page.reload();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByTestId('correo-sesion')).toContainText(email);
  // Entrar a /login con sesión viva devuelve a la lista.
  await page.goto('/login');
  await expect(page).toHaveURL(/\/tasks$/);
});

test('el logout limpia la sesión y protege las rutas privadas', async ({ page }) => {
  await registrarse(page);
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();

  await page.goto('/tasks');
  await expect(page).toHaveURL(/\/login$/);
  await page.goto('/tasks/nueva');
  await expect(page).toHaveURL(/\/login$/);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
});

test('se puede ir del login al registro y volver', async ({ page }) => {
  await page.goto('/login');
  await page.getByRole('button', { name: 'Crear una cuenta' }).click();
  await expect(page).toHaveURL(/\/register$/);
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
  await page.getByRole('button', { name: 'Iniciar sesión' }).click();
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole('heading', { name: 'Vuelve a tus pendientes' })).toBeVisible();
});
