// Contacts viven en Cloud Firestore a través del custom hook
// useContactsFirestore (con respaldo local cuando no hay .env de Firebase).
import { test, expect } from '@playwright/test';
import { agregarContacto, entrar, esperarVista, vista } from './ayudas';

test('crea, edita, conserva y elimina contactos', async ({ page }) => {
  await entrar(page);
  await expect(
    vista(page).getByText('Todavía no hay contactos. Agrega el primero arriba.'),
  ).toBeVisible();

  await vista(page).getByTestId('guardar-contacto').click();
  await expect(vista(page).getByRole('alert')).toHaveText('Escribe el nombre y el teléfono.');

  await agregarContacto(page, 'Ana Lopez', '3001234567');
  await agregarContacto(page, 'Bruno Diaz', '3109876543');
  await expect(vista(page).getByTestId('resumen-contacts')).toContainText('Contactos: 2');

  await page.reload();
  await esperarVista(page);
  await expect(vista(page).getByTestId('resumen-contacts')).toContainText('Contactos: 2');

  await vista(page).getByTestId('editar-contacto-Ana Lopez').click();
  await vista(page).getByPlaceholder('3001234567').fill('3001112233');
  await vista(page).getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(vista(page).getByText('3001112233')).toBeVisible();

  await vista(page).getByTestId('eliminar-contacto-Ana Lopez').click();
  await expect(vista(page).getByTestId('resumen-contacts')).toContainText('Contactos: 1');
  await vista(page).getByTestId('eliminar-contacto-Bruno Diaz').click();
  await expect(
    vista(page).getByText('Todavía no hay contactos. Agrega el primero arriba.'),
  ).toBeVisible();
});
