import { test, expect } from '@playwright/test';

const ORIGEN = 'http://127.0.0.1:4287';

test('useGeolocation entrega la posición cuando hay permiso', async ({ page, context }) => {
  await context.grantPermissions(['geolocation'], { origin: ORIGEN });
  await context.setGeolocation({ latitude: 3.3759, longitude: -76.5377 });
  await page.goto('/sensor/geolocation');
  await page.getByTestId('leer-posicion').click();
  await expect(page.getByTestId('datos-geolocation')).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId('dato-latitud')).toHaveText('3.375900');
  await expect(page.getByTestId('dato-longitud')).toHaveText('-76.537700');
});

test('useGeolocation muestra el error sin romper la página cuando se niega el permiso', async ({
  page,
  context,
}) => {
  await context.clearPermissions();
  await page.goto('/sensor/geolocation');
  await page.getByTestId('leer-posicion').click();
  await expect(
    page.getByTestId('error-geolocation').or(page.getByTestId('datos-geolocation')),
  ).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId('pagina-geolocation')).toBeVisible();
});

test('useDevice lee la información del equipo y avisa de la batería', async ({ page }) => {
  await page.goto('/sensor/device');
  await expect(page.getByTestId('datos-device')).toBeVisible({ timeout: 20000 });
  await expect(page.getByTestId('dato-plataforma')).toHaveText('web');
  await expect(page.getByTestId('datos-identidad')).toBeVisible();
  await expect(page.getByTestId('dato-código de idioma')).not.toHaveText('');
  await page.getByTestId('consultar-device').click();
  await expect(page.getByTestId('datos-device')).toBeVisible();
});

test('useFilesystem escribe, lista, lee y borra un archivo', async ({ page }) => {
  await page.goto('/sensor/filesystem');
  await page.getByTestId('nombre-archivo').locator('input').fill('prueba.txt');
  await page.getByTestId('contenido-archivo').locator('textarea').fill('Contenido de prueba 07');
  await page.getByTestId('escribir-archivo').click();

  await expect(page.getByTestId('aviso-filesystem')).toContainText('Guardado prueba.txt');
  await expect(page.getByTestId('lista-archivos')).toContainText('prueba.txt');

  await page.getByTestId('leer-prueba.txt').click();
  await expect(page.getByTestId('texto-leido')).toHaveText('Contenido de prueba 07');

  await page.getByTestId('borrar-prueba.txt').click();
  await expect(page.getByTestId('aviso-filesystem')).toContainText('Borrado prueba.txt');
  await expect(page.getByTestId('lista-archivos')).toHaveCount(0);
});

test('useCamera acepta el respaldo web con input type=file', async ({ page }) => {
  await page.goto('/sensor/camera');
  await page.getByTestId('entrada-archivo').setInputFiles('tests/fixtures/demo.png');
  await expect(page.getByTestId('foto')).toBeVisible();
  await expect(page.getByTestId('datos-camera')).toContainText('Respaldo web');
  await page.getByTestId('borrar-foto').click();
  await expect(page.getByTestId('foto')).toHaveCount(0);
});

test('useHaptics reporta si la plataforma puede vibrar o no', async ({ page }) => {
  await page.goto('/sensor/haptics');
  await page.getByTestId('vibrar').click();
  await expect(
    page.getByTestId('historial-haptics').or(page.getByTestId('error-haptics')),
  ).toBeVisible();
  await expect(page.getByTestId('datos-haptics')).toBeVisible();
});

test('useMotion registra y suelta los listeners de accel y orientation', async ({ page }) => {
  await page.goto('/sensor/motion');
  await expect(page.getByTestId('dato-escuchando')).toHaveText('no');
  await page.getByTestId('escuchar-motion').click();
  await expect(page.getByTestId('dato-escuchando')).toHaveText('sí');
  await page.getByTestId('escuchar-motion').click();
  await expect(page.getByTestId('dato-escuchando')).toHaveText('no');
});

test('useLocalNotifications programa y cancela una notificación', async ({ page, context }) => {
  await context.grantPermissions(['notifications'], { origin: ORIGEN });
  await page.goto('/sensor/local-notifications');
  await page.getByTestId('segundos-notificacion').locator('input').fill('300');
  await page.getByTestId('programar-notificacion').click();

  await expect(page.getByTestId('lista-pendientes')).toContainText('Recordatorio del Challenge 07');
  await expect(page.getByTestId('dato-pendientes')).toHaveText('1');

  await page.getByTestId('cancelar-todas').click();
  await expect(page.getByTestId('dato-pendientes')).toHaveText('0');
});

test('usePushNotifications avisa que el navegador no tiene implementación', async ({ page }) => {
  await page.goto('/sensor/push-notifications');
  await expect(page.getByTestId('nivel-soporte')).toHaveText(
    'No disponible en navegador — requiere dispositivo',
  );
  await expect(page.getByTestId('dato-implementación disponible')).toHaveText('no');
  await page.getByTestId('registrar-push').click();
  await expect(page.getByTestId('error-push-notifications')).toContainText('Android o iOS');
  await expect(page.getByTestId('pagina-push-notifications')).toBeVisible();
});
