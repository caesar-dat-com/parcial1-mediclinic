// Ayudas compartidas por las pruebas: crean una cuenta nueva y dejan la app en la lista.
import { expect } from '@playwright/test';

export const CLAVE = 'secreta123';

export function correoNuevo(prefijo = 'cesar') {
  return `${prefijo}.${Date.now()}.${Math.floor(Math.random() * 1000)}@mail.com`;
}

export async function registrarse(page, email = correoNuevo(), password = CLAVE) {
  await page.goto('/register');
  await expect(page.getByRole('button', { name: 'Registrarme' })).toBeVisible();
  await page.getByPlaceholder('tucorreo@mail.com').fill(email);
  await page.getByPlaceholder('Mínimo 6 caracteres').fill(password);
  await page.getByPlaceholder('Repite la contraseña').fill(password);
  await page.getByRole('button', { name: 'Registrarme' }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  return { email, password };
}

export async function entrar(page, email, password = CLAVE) {
  await page.goto('/login');
  await expect(page.getByRole('button', { name: 'Ingresar' })).toBeVisible();
  await page.getByPlaceholder('tucorreo@mail.com').fill(email);
  await page.getByPlaceholder('Tu contraseña').fill(password);
  await page.getByRole('button', { name: 'Ingresar' }).click();
}

// Ionic deja en el DOM las paginas por las que ya se paso (con .ion-page-hidden), asi que
// las pruebas buscan los titulos dentro de la lista y no en toda la pagina.
export function lista(page) {
  return page.locator('ion-list[aria-label="Lista de tareas"]');
}

export async function crearTarea(page, titulo, detalle = '') {
  await page.getByRole('button', { name: 'Nueva tarea' }).click();
  await expect(page).toHaveURL(/\/tasks\/nueva$/);
  await page.getByPlaceholder('Por ejemplo, repasar para el parcial').fill(titulo);
  if (detalle) await page.getByPlaceholder('Agrega una nota (opcional)').fill(detalle);
  await page.getByRole('button', { name: 'Crear tarea' }).click();
  await expect(page).toHaveURL(/\/tasks$/);
  await expect(lista(page).getByText(titulo, { exact: true })).toBeVisible();
}
