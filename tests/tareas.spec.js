import { test, expect } from '@playwright/test';
import { crearTarea, lista, registrarse } from './ayudas';

test('crea una tarea y la lista la muestra con el contador de pendientes', async ({ page }) => {
  await registrarse(page);
  await expect(page.getByText('Todavía no hay tareas. Crea la primera con el botón de arriba.')).toBeVisible();

  await page.getByRole('button', { name: 'Nueva tarea' }).click();
  await page.getByRole('button', { name: 'Crear tarea' }).click();
  await expect(page.getByRole('alert')).toHaveText('Escribe qué tienes pendiente.');
  await page.getByRole('button', { name: 'Cancelar' }).click();
  await expect(page).toHaveURL(/\/tasks$/);

  await crearTarea(page, 'Repasar Firebase Auth', 'Revisar onAuthStateChanged.');
  await expect(page.getByText('Pendientes: 1 de 1')).toBeVisible();
});

test('abre el detalle de la tarea con su nota y la marca como completa', async ({ page }) => {
  await registrarse(page);
  await crearTarea(page, 'Leer sobre Firestore', 'Consultas con where y orderBy.');

  await page.getByRole('button', { name: 'Ver Leer sobre Firestore' }).click();
  await expect(page).toHaveURL(/\/tasks\/[^/]+$/);
  await expect(page.getByTestId('detalle-titulo')).toHaveText('Leer sobre Firestore');
  await expect(page.getByTestId('detalle-detalle')).toHaveText('Consultas con where y orderBy.');
  await expect(page.getByTestId('detalle-estado')).toContainText('Pendiente');

  await page.getByRole('button', { name: 'Marcar como completa' }).click();
  await expect(page.getByTestId('detalle-estado')).toContainText('Completa');
});

test('edita el título y el detalle de una tarea existente', async ({ page }) => {
  await registrarse(page);
  await crearTarea(page, 'Tarea sin terminar', 'Primera version.');

  await page.getByRole('button', { name: 'Ver Tarea sin terminar' }).click();
  await page.getByRole('button', { name: 'Editar tarea' }).click();
  await expect(page).toHaveURL(/\/tasks\/[^/]+\/editar$/);
  await expect(page.getByRole('heading', { name: 'Ajusta la tarea' })).toBeVisible();

  await page.getByPlaceholder('Por ejemplo, repasar para el parcial').fill('Tarea ya corregida');
  await page.getByPlaceholder('Agrega una nota (opcional)').fill('Segunda version con cambios.');
  await page.getByRole('button', { name: 'Guardar cambios' }).click();

  await expect(page).toHaveURL(/\/tasks$/);
  await expect(lista(page).getByText('Tarea ya corregida', { exact: true })).toBeVisible();
  await expect(lista(page).getByText('Tarea sin terminar', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Ver Tarea ya corregida' }).click();
  await expect(page.getByTestId('detalle-detalle')).toHaveText('Segunda version con cambios.');
});

test('marca y desmarca la tarea desde la lista', async ({ page }) => {
  await registrarse(page);
  await crearTarea(page, 'Subir el challenge');
  await expect(page.getByText('Pendientes: 1 de 1')).toBeVisible();

  await page.getByRole('checkbox', { name: 'Marcar Subir el challenge' }).click();
  await expect(page.getByText('Pendientes: 0 de 1')).toBeVisible();
  await page.getByRole('checkbox', { name: 'Marcar Subir el challenge' }).click();
  await expect(page.getByText('Pendientes: 1 de 1')).toBeVisible();
});

test('las tareas del usuario sobreviven una recarga', async ({ page }) => {
  await registrarse(page);
  await crearTarea(page, 'Primera tarea');
  await crearTarea(page, 'Segunda tarea');
  await expect(page.getByText('Pendientes: 2 de 2')).toBeVisible();

  await page.reload();
  await expect(lista(page).getByText('Primera tarea', { exact: true })).toBeVisible();
  await expect(lista(page).getByText('Segunda tarea', { exact: true })).toBeVisible();
  await expect(page.getByText('Pendientes: 2 de 2')).toBeVisible();
});

test('elimina una tarea desde la lista y desde el detalle', async ({ page }) => {
  await registrarse(page);
  await crearTarea(page, 'Borrar desde la lista');
  await crearTarea(page, 'Borrar desde el detalle');

  await page.getByRole('button', { name: 'Eliminar Borrar desde la lista' }).click();
  await expect(lista(page).getByText('Borrar desde la lista', { exact: true })).toHaveCount(0);

  await page.getByRole('button', { name: 'Ver Borrar desde el detalle' }).click();
  await page.getByRole('button', { name: 'Eliminar tarea' }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(page.getByText('Todavía no hay tareas. Crea la primera con el botón de arriba.')).toBeVisible();
});
