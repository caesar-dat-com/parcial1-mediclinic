import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const worker = 'service-worker.js';
async function listar(carpeta) {
  const entradas = await readdir(carpeta, { withFileTypes: true });
  const grupos = await Promise.all(entradas.map((e) => {
    const ruta = `${carpeta}/${e.name}`;
    return e.isDirectory() ? listar(ruta) : ruta;
  }));
  return grupos.flat();
}

const archivos = (await listar('dist')).filter((p) =>
  p !== `dist/${worker}` && !p.endsWith('.map') && !p.endsWith('/_redirects')
).sort();
const plantilla = await readFile(`scripts/${worker}`, 'utf8');
const hash = createHash('sha256').update(plantilla);
for (const archivo of archivos) hash.update(await readFile(archivo));
const version = hash.digest('hex').slice(0, 12);
const resultado = plantilla
  .replace('__CACHE__', `mediclinic-${version}`)
  .replace('__ARCHIVOS__', JSON.stringify(archivos.map((p) => p.slice(4))));
await writeFile(`dist/${worker}`, resultado);
console.log(`PWA lista: ${archivos.length} archivos guardados para usar sin conexión.`);
