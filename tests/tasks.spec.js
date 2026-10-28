// Tasks viven en Firebase RealTime Database a través del custom hook
// useTasksRealtime (con respaldo local cuando no hay .env de Firebase).
import { test, expect } from '@playwright/test';
import { agregarTarea, entrar, esperarVista, irA, vista } from './ayudas';

test('crea, completa, conserva y elimina tareas', async ({ page }) => {
  await entrar(page);
  await irA(page, 'Tasks');
  await expect(
    vista(page).getByText('Todavía no hay tareas. Agrega la primera arriba.'),
  ).toBeVisible();

  await vista(page).getByTestId('agregar-tarea').click();
  await expect(vista(page).getByRole('alert')).toHaveText('Escribe qué tienes pendiente.');

  await agregarTarea(page, 'Repasar RealTime Database');
  await agregarTarea(page, 'Subir el challenge');
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 2 de 2');

  await vista(page).getByRole('checkbox', { name: 'Repasar RealTime Database' }).click();
  await expect(
    vista(page).getByRole('checkbox', { name: 'Repasar RealTime Database' }),
  ).toBeChecked();
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 1 de 2');

  await page.reload();
  await esperarVista(page);
  await expect(
    vista(page).getByRole('checkbox', { name: 'Repasar RealTime Database' }),
  ).toBeChecked();
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 1 de 2');

  await vista(page).getByTestId('eliminar-tarea-Repasar RealTime Database').click();
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 1 de 1');
  await vista(page).getByTestId('eliminar-tarea-Subir el challenge').click();
  await expect(
    vista(page).getByText('Todavía no hay tareas. Agrega la primera arriba.'),
  ).toBeVisible();
});
