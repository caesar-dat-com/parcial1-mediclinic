import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { defineConfig } from '@playwright/test';

// Busca un Chromium ya instalado para no descargar nada al correr las pruebas en local.
// En CI el workflow hace `npx playwright install chromium` y esto devuelve undefined,
// asi que Playwright usa su propio navegador.
function chromiumDisponible() {
  if (process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE) return process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE;
  const cache = join(homedir(), '.cache', 'ms-playwright');
  if (existsSync(cache)) {
    const carpetas = readdirSync(cache).filter((nombre) => nombre.startsWith('chromium-'));
    for (const carpeta of carpetas.sort().reverse()) {
      for (const linux of ['chrome-linux64', 'chrome-linux-arm64', 'chrome-linux']) {
        const ruta = join(cache, carpeta, linux, 'chrome');
        if (existsSync(ruta)) return ruta;
      }
    }
  }
  for (const ruta of ['/usr/bin/chromium', '/usr/bin/chromium-browser', '/usr/bin/google-chrome']) {
    if (existsSync(ruta)) return ruta;
  }
  return undefined;
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  projects: [{ name: 'chromium', use: { browserName: 'chromium' } }],
  use: {
    baseURL: 'http://127.0.0.1:4285',
    viewport: { width: 390, height: 844 },
    trace: 'retain-on-failure',
    launchOptions: { executablePath: chromiumDisponible() },
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4285 --strictPort',
    url: 'http://127.0.0.1:4285',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
