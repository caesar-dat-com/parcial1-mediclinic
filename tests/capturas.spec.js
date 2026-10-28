import { test, expect } from '@playwright/test';
import { SENSORES } from '../src/sensores.js';

// Genera las capturas reales que se enlazan en el README.
const ORIGEN = 'http://127.0.0.1:4287';
const DESTINO = 'capturas';

test.describe('capturas', () => {
  test('captura la Home con los ocho botones', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('botones-sensores')).toBeVisible();
    await page.screenshot({ path: `${DESTINO}/home.png` });
  });

  test('captura cada página de sensor', async ({ page, context }) => {
    await context.grantPermissions(['geolocation', 'notifications'], { origin: ORIGEN });
    await context.setGeolocation({ latitude: 3.3759, longitude: -76.5377 });

    for (const sensor of SENSORES) {
      await page.goto(`/sensor/${sensor.slug}`);
      await expect(page.getByTestId('estado-soporte')).toBeVisible();

      // Un poco de interacción para que la captura muestre datos reales.
      if (sensor.slug === 'geolocation') {
        await page.getByTestId('leer-posicion').click();
        await expect(
          page.getByTestId('datos-geolocation').or(page.getByTestId('error-geolocation')),
        ).toBeVisible({ timeout: 20000 });
      }
      if (sensor.slug === 'camera') {
        await page.getByTestId('entrada-archivo').setInputFiles('tests/fixtures/demo.png');
        await expect(page.getByTestId('foto')).toBeVisible();
      }
      if (sensor.slug === 'motion') {
        await page.getByTestId('escuchar-motion').click();
        await expect(page.getByTestId('dato-escuchando')).toHaveText('sí');
      }
      if (sensor.slug === 'device') {
        await expect(page.getByTestId('datos-device')).toBeVisible({ timeout: 20000 });
      }
      if (sensor.slug === 'haptics') {
        await page.getByTestId('vibrar').click();
        await expect(
          page.getByTestId('historial-haptics').or(page.getByTestId('error-haptics')),
        ).toBeVisible();
      }
      if (sensor.slug === 'filesystem') {
        await page.getByTestId('nombre-archivo').locator('input').fill('nota.txt');
        await page.getByTestId('escribir-archivo').click();
        await expect(page.getByTestId('lista-archivos')).toContainText('nota.txt');
      }
      if (sensor.slug === 'local-notifications') {
        await page.getByTestId('programar-notificacion').click();
        await expect(
          page
            .getByTestId('lista-pendientes')
            .or(page.getByTestId('error-local-notifications')),
        ).toBeVisible();
      }
      if (sensor.slug === 'push-notifications') {
        await page.getByTestId('registrar-push').click();
        await expect(page.getByTestId('error-push-notifications')).toBeVisible();
      }

      await page.screenshot({ path: `${DESTINO}/${sensor.slug}.png` });
    }
  });
});
