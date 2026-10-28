import { test, expect } from '@playwright/test';
import { crearTarea, lista, CLAVE, correoNuevo } from './ayudas';

// Ionic deja la pagina anterior en el DOM mientras hace la transicion. Para que las capturas
// no salgan con dos pantallas encimadas se espera a que la anterior quede oculta.
async function esperarTransicion(page, anterior) {
  await expect(anterior).toBeHidden();
  await page.waitForTimeout(400);
}

// Las capturas de la carpeta capturas/ se generan aqui, para que siempre correspondan
// a la version que pasa las pruebas.
test('genera las capturas de la entrega', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByRole('heading', { name: 'Vuelve a tus pendientes' })).toBeVisible();
  await page.screenshot({ path: 'capturas/login.png' });

  const tituloLogin = page.getByRole('heading', { name: 'Vuelve a tus pendientes' });
  await page.getByRole('button', { name: 'Crear una cuenta' }).click();
  await expect(page.getByRole('heading', { name: 'Crea tu cuenta' })).toBeVisible();
  await esperarTransicion(page, tituloLogin);
  // Se apunta al formulario de registro (el unico que pide confirmar la contraseña).
  const registro = page
    .locator('form')
    .filter({ has: page.getByPlaceholder('Repite la contraseña') });
  const email = correoNuevo('captura');
  await registro.getByPlaceholder('tucorreo@mail.com').fill(email);
  await registro.getByPlaceholder('Mínimo 6 caracteres').fill(CLAVE);
  await registro.getByPlaceholder('Repite la contraseña').fill(CLAVE);
  await page.screenshot({ path: 'capturas/register.png' });

  await registro.getByRole('button', { name: 'Registrarme' }).click();
  await expect(page).toHaveURL(/\/tasks$/);

  await crearTarea(page, 'Entregar el challenge 05', 'Firebase Auth + Firestore con custom hooks.');
  await crearTarea(page, 'Repasar contextos de React');
  await page.getByRole('checkbox', { name: 'Marcar Repasar contextos de React' }).click();
  await expect(page.getByText('Pendientes: 1 de 2')).toBeVisible();
  await page.waitForTimeout(400);
  await page.screenshot({ path: 'capturas/tareas.png' });

  await page.getByRole('button', { name: 'Ver Entregar el challenge 05' }).click();
  await expect(page.getByTestId('detalle-titulo')).toHaveText('Entregar el challenge 05');
  await esperarTransicion(page, lista(page));
  await page.screenshot({ path: 'capturas/detalle.png' });

  const tituloDetalle = page.getByTestId('detalle-titulo');
  await page.getByRole('button', { name: 'Editar tarea' }).click();
  await expect(page.getByRole('heading', { name: 'Ajusta la tarea' })).toBeVisible();
  await esperarTransicion(page, tituloDetalle);
  await page.screenshot({ path: 'capturas/editar.png' });
});
