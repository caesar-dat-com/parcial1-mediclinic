// Fruits viven en Dexie (IndexedDB) a través del custom hook useFruitsDexie,
// que incluye la `newFunction` del enunciado.
import { test, expect } from '@playwright/test';
import { agregarFruta, buscarFruta, entrar, esperarVista, irA, vista } from './ayudas';

test('crea, edita y elimina frutas en Dexie', async ({ page }) => {
  await entrar(page);
  await irA(page, 'Fruits');
  await expect(
    vista(page).getByText('Todavía no hay frutas. Agrega la primera arriba.'),
  ).toBeVisible();

  await vista(page).getByTestId('guardar-fruta').click();
  await expect(vista(page).getByRole('alert')).toHaveText('Escribe el nombre de la fruta.');

  await agregarFruta(page, 'Mango', 12);
  await agregarFruta(page, 'Maracuya', 5);
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 2 de 2');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 17');

  // Dexie guarda en IndexedDB: tras recargar siguen ahí.
  await page.reload();
  await esperarVista(page);
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 17');

  await vista(page).getByTestId('editar-fruta-Mango').click();
  await vista(page).getByPlaceholder('Por ejemplo, 12').fill('20');
  await vista(page).getByRole('button', { name: 'Guardar cambios' }).click();
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 25');

  await vista(page).getByTestId('eliminar-fruta-Maracuya').click();
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 1 de 1');
  await vista(page).getByTestId('eliminar-fruta-Mango').click();
  await expect(
    vista(page).getByText('Todavía no hay frutas. Agrega la primera arriba.'),
  ).toBeVisible();
});

test('newFunction filtra y cuenta la tabla de frutas en vivo', async ({ page }) => {
  await entrar(page);
  await irA(page, 'Fruits');

  await agregarFruta(page, 'Mango', 10);
  await agregarFruta(page, 'Manzana', 4);
  await agregarFruta(page, 'Papaya', 3);
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 3 de 3');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 17');

  // newFunction: busca por nombre, sin importar mayúsculas.
  await buscarFruta(page, 'man');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 2 de 3');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 14');
  await expect(vista(page).getByRole('heading', { name: 'Papaya', level: 2 })).toBeHidden();

  await buscarFruta(page, 'MANZ');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 1 de 3');
  await expect(vista(page).getByRole('heading', { name: 'Manzana', level: 2 })).toBeVisible();

  await buscarFruta(page, 'kiwi');
  await expect(vista(page).getByText('Ninguna fruta coincide con "kiwi".')).toBeVisible();

  await buscarFruta(page, '');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 3 de 3');
});
