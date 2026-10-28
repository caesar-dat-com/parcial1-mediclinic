import { test, expect } from '@playwright/test';
import { SENSORES } from '../src/sensores.js';

// Un test por sensor: entra a su página, comprueba que renderiza su contenido
// y que el custom hook publicó un estado de disponibilidad, sin reventar.
const ETIQUETAS = [
  'Disponible en este dispositivo',
  'Soporte parcial en navegador',
  'No disponible en navegador — requiere dispositivo',
];

for (const sensor of SENSORES) {
  test(`la página de ${sensor.titulo} renderiza y publica su disponibilidad`, async ({ page }) => {
    const errores = [];
    page.on('pageerror', (fallo) => errores.push(fallo.message));

    await page.goto(`/sensor/${sensor.slug}`);
    const pagina = page.getByTestId(`pagina-${sensor.slug}`);
    await expect(pagina).toBeVisible();

    // Contenido propio del sensor.
    await expect(pagina.getByTestId('titulo-sensor')).toHaveText(sensor.titulo);
    await expect(pagina).toContainText(sensor.plugin);
    await expect(pagina).toContainText(sensor.hook);

    // Estado de disponibilidad calculado por el hook.
    const estado = pagina.getByTestId('estado-soporte');
    await expect(estado).toBeVisible();
    const nivel = await pagina.getByTestId('nivel-soporte').innerText();
    expect(ETIQUETAS).toContain(nivel.trim());
    await expect(pagina.getByTestId('plataforma')).toHaveText('web');

    // Al menos un botón de acción y ningún error de JavaScript.
    await expect(pagina.locator('ion-button')).not.toHaveCount(0);
    expect(errores).toEqual([]);
  });
}
