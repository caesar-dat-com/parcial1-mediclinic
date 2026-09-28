import { test, expect } from '@playwright/test';

test('agregar, completar, recuperar y eliminar tareas', async ({ page }) => {
  await page.goto('/');
  
  await expect(page.getByText('Todavía no hay tareas. Agrega la primera arriba.')).toBeVisible();
  await page.getByRole('button', { name: 'Agregar tarea', exact: true }).click();
  await expect(page.getByRole('alert')).toHaveText('Escribe qué tienes pendiente.');
  await page.getByPlaceholder('Por ejemplo, repasar para el parcial').fill('Repasar Ionic');
  await page.getByRole('button', { name: 'Agregar tarea', exact: true }).click();
  await expect(page.getByText('Pendientes: 1 de 1')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Repasar Ionic' }).click();
  await expect(page.getByRole('checkbox', { name: 'Repasar Ionic' })).toBeChecked();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Repasar Ionic' })).toBeChecked();
  await expect(page.getByText('Pendientes: 0 de 1')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Repasar Ionic' }).click();
  await expect(page.getByRole('checkbox', { name: 'Repasar Ionic' })).not.toBeChecked();
  await page.getByRole('button', { name: 'Eliminar Repasar Ionic' }).click();
  await page.reload();
  await expect(page.getByText('Todavía no hay tareas. Agrega la primera arriba.')).toBeVisible();
});
