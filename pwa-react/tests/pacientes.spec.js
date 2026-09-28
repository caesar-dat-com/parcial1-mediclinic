import { test, expect } from '@playwright/test';

async function llenar(page, nombre, apellido, cc) {
  await page.getByLabel('Nombre', { exact: true }).fill(nombre);
  await page.getByLabel('Apellido', { exact: true }).fill(apellido);
  await page.getByLabel('CC', { exact: true }).fill(cc);
}

test('sesión y CRUD de pacientes con validación de CC', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await expect(page.getByText('Usuario o contraseña incorrectos')).toBeVisible();
  await page.getByLabel('Usuario', { exact: true }).fill('admin@mediclinic.com');
  await page.getByLabel('Contraseña').fill('123');
  await page.getByRole('button', { name: 'Ingresar' }).click();
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page.getByText('Mínimo 2 letras, sin números')).toHaveCount(2);
  await llenar(page, 'Ana', 'Gómez', '12345678');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await llenar(page, 'Luis', 'Torres', '12345678');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  await expect(page.getByText('Ya existe un paciente con esa CC')).toBeVisible();
  await page.getByLabel('CC', { exact: true }).fill('87654321');
  await page.getByRole('button', { name: 'Guardar', exact: true }).click();
  const ana = page.locator('li').filter({ hasText: 'Ana Gómez' });
  await ana.getByRole('button', { name: 'Editar' }).click();
  await page.getByLabel('CC', { exact: true }).fill('87654321');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(page.getByText('Ya existe un paciente con esa CC')).toBeVisible();
  await llenar(page, 'Ana María', 'Gómez', '12345678');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();
  await page.reload();
  await expect(page.getByText('Ana María Gómez', { exact: true })).toBeVisible();
  await page.getByPlaceholder('Buscar por nombre, apellido o CC').fill('nadie');
  await expect(page.locator('li')).toHaveCount(0);
  await page.getByPlaceholder('Buscar por nombre, apellido o CC').fill('12345678');
  await expect(page.locator('li')).toHaveCount(1);
  await page.getByRole('button', { name: 'Editar', exact: true }).click();
  await page.getByLabel('Nombre', { exact: true }).fill('Descartar');
  await page.getByRole('button', { name: 'Cancelar edición' }).click();
  await expect(page.getByText('Ana María Gómez', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Eliminar', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Ana María Gómez', { exact: true })).toHaveCount(0);
  await expect(page.locator('li')).toHaveCount(1);
  await page.getByRole('button', { name: 'Cerrar sesión' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
});
