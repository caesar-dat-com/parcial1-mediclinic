import { test, expect } from '@playwright/test';

test('abre sin internet desde la primera visita', async ({ page, context }) => {
  await page.goto('/');
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.waitForFunction(() => !!navigator.serviceWorker.controller);
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('button', { name: 'Agregar', exact: true })).toBeVisible();
  const recursos = await page.evaluate(async () => {
    const nombres = await caches.keys();
    const archivos = await Promise.all(nombres.map(async (n) => (await (await caches.open(n)).keys()).map((r) => r.url)));
    return archivos.flat();
  });
  expect(recursos.some((url) => url.endsWith('.js'))).toBe(true);
  expect(recursos.some((url) => url.endsWith('.css'))).toBe(true);
});
