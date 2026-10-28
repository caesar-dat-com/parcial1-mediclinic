// Genera las capturas que acompañan el README.
import { test, expect } from '@playwright/test';
import {
  agregarContacto,
  agregarFruta,
  agregarTarea,
  buscarFruta,
  entrar,
  esperarVista,
  irA,
  vista,
} from './ayudas';

test('genera las capturas del README', async ({ page, context }) => {
  await page.goto('/login');
  await esperarVista(page);
  await expect(vista(page).getByRole('button', { name: 'Ingresar' })).toBeVisible();
  await page.screenshot({ path: 'capturas/login.png' });

  await entrar(page);
  await agregarContacto(page, 'Ana Lopez', '3001234567');
  await agregarContacto(page, 'Bruno Diaz', '3109876543');
  await page.screenshot({ path: 'capturas/contacts.png' });

  await irA(page, 'Tasks');
  await agregarTarea(page, 'Repasar RealTime Database');
  await agregarTarea(page, 'Entregar el challenge 06');
  await vista(page).getByRole('checkbox', { name: 'Repasar RealTime Database' }).click();
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 1 de 2');
  await page.screenshot({ path: 'capturas/tasks.png' });

  await irA(page, 'Fruits');
  await agregarFruta(page, 'Mango', 12);
  await agregarFruta(page, 'Manzana', 4);
  await agregarFruta(page, 'Papaya', 3);
  await buscarFruta(page, 'man');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 2 de 3');
  await page.screenshot({ path: 'capturas/fruits.png' });

  await buscarFruta(page, '');
  await context.setOffline(true);
  await expect(vista(page).getByTestId('estado-red')).toHaveText('Sin conexión');
  await expect(vista(page).getByTestId('aviso-fruits')).toBeVisible();
  await page.screenshot({ path: 'capturas/sin-red-fruits.png' });

  await irA(page, 'Contacts');
  await expect(vista(page).getByTestId('aviso-contacts')).toBeVisible();
  await page.screenshot({ path: 'capturas/sin-red.png' });
  await context.setOffline(false);
});
