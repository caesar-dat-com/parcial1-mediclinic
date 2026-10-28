import { test, expect } from '@playwright/test';
import { SENSORES } from '../src/sensores.js';

test('la Home muestra un botón por cada sensor del enunciado', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('pagina-home')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Sensores del dispositivo' })).toBeVisible();

  const botones = page.getByTestId('botones-sensores').locator('ion-button');
  await expect(botones).toHaveCount(SENSORES.length);
  expect(SENSORES.length).toBe(8);

  for (const sensor of SENSORES) {
    await expect(page.getByTestId(`boton-${sensor.slug}`)).toContainText(sensor.titulo);
  }
  await expect(page.getByTestId('total-sensores')).toContainText('8 sensores');
});

test('cada botón de la Home abre la página de su sensor y se puede volver', async ({ page }) => {
  for (const sensor of SENSORES) {
    await page.goto('/');
    await page.getByTestId(`boton-${sensor.slug}`).click();
    await expect(page).toHaveURL(new RegExp(`/sensor/${sensor.slug}$`));
    const pagina = page.getByTestId(`pagina-${sensor.slug}`);
    await expect(pagina).toBeVisible();
    await expect(pagina.getByTestId('titulo-sensor')).toHaveText(sensor.titulo);
  }
});

test('una ruta desconocida regresa a la Home', async ({ page }) => {
  await page.goto('/sensor/no-existe');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByTestId('pagina-home')).toBeVisible();
});
