// Punto central del enunciado: sin conexión, Contacts y Tasks (remotos) quedan
// deshabilitados y Fruits (Dexie, local) sigue operativo.
import { test, expect } from '@playwright/test';
import {
  agregarContacto,
  agregarFruta,
  agregarTarea,
  buscarFruta,
  entrar,
  esperarDeshabilitado,
  irA,
  vista,
} from './ayudas';

test('sin red deshabilita las acciones de Contacts y Tasks', async ({ page, context }) => {
  await entrar(page);
  await agregarContacto(page, 'Ana Lopez', '3001234567');
  await irA(page, 'Tasks');
  await agregarTarea(page, 'Revisar Firestore');
  await expect(vista(page).getByTestId('estado-red')).toContainText('En línea');

  await context.setOffline(true);
  await expect(vista(page).getByTestId('estado-red')).toHaveText('Sin conexión');

  // Tasks: formulario, checkbox y borrado deshabilitados.
  await expect(vista(page).getByTestId('aviso-tasks')).toBeVisible();
  await esperarDeshabilitado(vista(page).getByTestId('agregar-tarea'));
  await esperarDeshabilitado(vista(page).getByTestId('completar-tarea-Revisar Firestore'));
  await esperarDeshabilitado(vista(page).getByTestId('eliminar-tarea-Revisar Firestore'));

  // Aunque se fuerce el clic, nada cambia.
  await vista(page).getByTestId('eliminar-tarea-Revisar Firestore').click({ force: true });
  await expect(vista(page).getByTestId('resumen-tasks')).toContainText('Pendientes: 1 de 1');

  // Contacts: lo mismo.
  await irA(page, 'Contacts');
  await expect(vista(page).getByTestId('aviso-contacts')).toBeVisible();
  await esperarDeshabilitado(vista(page).getByTestId('guardar-contacto'));
  await esperarDeshabilitado(vista(page).getByTestId('editar-contacto-Ana Lopez'));
  await esperarDeshabilitado(vista(page).getByTestId('eliminar-contacto-Ana Lopez'));
  await vista(page).getByTestId('eliminar-contacto-Ana Lopez').click({ force: true });
  await expect(vista(page).getByTestId('resumen-contacts')).toContainText('Contactos: 1');

  // Al volver la red se habilita todo otra vez.
  await context.setOffline(false);
  await expect(vista(page).getByTestId('estado-red')).toContainText('En línea');
  await esperarDeshabilitado(vista(page).getByTestId('guardar-contacto'), false);
  await esperarDeshabilitado(vista(page).getByTestId('eliminar-contacto-Ana Lopez'), false);
  await vista(page).getByTestId('eliminar-contacto-Ana Lopez').click();
  await expect(vista(page).getByTestId('resumen-contacts')).toContainText('Contactos: 0');
});

test('sin red Fruits sigue funcionando porque Dexie es local', async ({ page, context }) => {
  await entrar(page);
  await irA(page, 'Fruits');
  await agregarFruta(page, 'Mango', 6);

  await context.setOffline(true);
  await expect(vista(page).getByTestId('estado-red')).toHaveText('Sin conexión');
  await expect(vista(page).getByTestId('aviso-fruits')).toBeVisible();

  // Nada de Fruits está deshabilitado.
  await esperarDeshabilitado(vista(page).getByTestId('guardar-fruta'), false);
  await esperarDeshabilitado(vista(page).getByTestId('eliminar-fruta-Mango'), false);

  // Y el CRUD completo funciona sin conexión.
  await agregarFruta(page, 'Guanabana', 2);
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 2 de 2');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Unidades: 8');

  await buscarFruta(page, 'gua');
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 1 de 2');
  await buscarFruta(page, '');

  await vista(page).getByTestId('eliminar-fruta-Mango').click();
  await expect(vista(page).getByTestId('resumen-frutas')).toContainText('Frutas: 1 de 1');
});
