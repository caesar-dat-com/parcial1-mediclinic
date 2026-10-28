import { expect } from '@playwright/test';

export const CUENTA = { email: 'user@mail.com', password: '123' };

/**
 * IonRouterOutlet deja las páginas anteriores montadas en el DOM (así hace las
 * transiciones), así que todas las búsquedas se hacen sobre la página activa:
 * Ionic marca las demás con la clase `ion-page-hidden`.
 */
export function vista(page) {
  return page.locator('div.ion-page:not(.ion-page-hidden)');
}

/** Espera a que termine la transición y quede una sola página activa. */
export async function esperarVista(page) {
  await expect(vista(page)).toHaveCount(1);
}

/** Entra con la cuenta del curso y deja la app en /contacts. */
export async function entrar(page) {
  await page.goto('/login');
  await esperarVista(page);
  await expect(vista(page).getByRole('button', { name: 'Ingresar' })).toBeVisible();
  await vista(page).getByPlaceholder('user@mail.com').fill(CUENTA.email);
  await vista(page).locator('input[type=password]').fill(CUENTA.password);
  await vista(page).getByRole('button', { name: 'Ingresar' }).click();
  await expect(page).toHaveURL(/\/contacts$/);
  await esperarVista(page);
}

/** Navega entre secciones usando la barra de rutas. */
export async function irA(page, seccion) {
  await vista(page).getByRole('button', { name: seccion, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(`/${seccion.toLowerCase()}$`));
  await esperarVista(page);
  await expect(vista(page).getByRole('heading', { name: seccion, level: 1 })).toBeVisible();
}

/** Los componentes de Ionic reflejan `disabled` en el host, lo leemos de ahí. */
export async function esperarDeshabilitado(locator, deshabilitado = true) {
  await expect(locator).toHaveJSProperty('disabled', deshabilitado);
}

export async function agregarContacto(page, nombre, telefono) {
  await vista(page).getByPlaceholder('Por ejemplo, Ana Lopez').fill(nombre);
  await vista(page).getByPlaceholder('3001234567').fill(telefono);
  await vista(page).getByTestId('guardar-contacto').click();
  await expect(vista(page).getByRole('heading', { name: nombre, level: 2 })).toBeVisible();
}

export async function agregarTarea(page, titulo) {
  await vista(page).getByPlaceholder('Por ejemplo, repasar para el parcial').fill(titulo);
  await vista(page).getByTestId('agregar-tarea').click();
  await expect(vista(page).getByRole('checkbox', { name: titulo })).toBeVisible();
}

export async function agregarFruta(page, nombre, cantidad) {
  await vista(page).getByPlaceholder('Por ejemplo, Mango').fill(nombre);
  await vista(page).getByPlaceholder('Por ejemplo, 12').fill(String(cantidad));
  await vista(page).getByTestId('guardar-fruta').click();
  await expect(vista(page).getByRole('heading', { name: nombre, level: 2 })).toBeVisible();
}

export async function buscarFruta(page, texto) {
  await vista(page).getByPlaceholder('Escribe parte del nombre').fill(texto);
}
