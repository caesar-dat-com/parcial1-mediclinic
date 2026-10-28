// Ayudas compartidas por los ocho custom hooks.
//
// Varios plugins de Capacitor solo funcionan completos sobre un dispositivo
// real. En el navegador unos traen una implementación parcial y otros
// directamente lanzan "not implemented". En lugar de dejar que la página
// reviente, cada hook consulta aquí qué nivel de soporte tiene y guarda el
// mensaje de error para mostrarlo en pantalla.

import { Capacitor } from '@capacitor/core';

export const NIVELES = {
  completo: {
    etiqueta: 'Disponible en este dispositivo',
    color: 'success',
  },
  parcial: {
    etiqueta: 'Soporte parcial en navegador',
    color: 'warning',
  },
  noDisponible: {
    etiqueta: 'No disponible en navegador — requiere dispositivo',
    color: 'danger',
  },
};

export function plataforma() {
  try {
    return Capacitor.getPlatform();
  } catch {
    return 'web';
  }
}

export function esNativo() {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

export function pluginRegistrado(nombre) {
  try {
    return Capacitor.isPluginAvailable(nombre);
  } catch {
    return false;
  }
}

/**
 * Decide el nivel de soporte de un plugin en la plataforma actual.
 *
 * @param {string} nombre  Nombre del plugin registrado en Capacitor.
 * @param {object} opciones
 * @param {boolean} opciones.soportaWeb  El plugin (o un respaldo del
 *        navegador) sirve de verdad en web.
 * @param {string} opciones.nota  Aclaración honesta de la limitación.
 */
export function revisarSoporte(nombre, { soportaWeb = false, nota = '' } = {}) {
  const actual = plataforma();
  const nativo = esNativo();
  const registrado = pluginRegistrado(nombre);

  let nivel = 'noDisponible';
  if (nativo && registrado) nivel = 'completo';
  else if (soportaWeb) nivel = 'parcial';

  return {
    plugin: nombre,
    plataforma: actual,
    nativo,
    registrado,
    soportaWeb,
    nota,
    nivel,
    etiqueta: NIVELES[nivel].etiqueta,
    color: NIVELES[nivel].color,
  };
}

/** Convierte cualquier cosa que lance un plugin en un texto legible. */
export function mensajeError(error, respaldo = 'Ocurrió un error inesperado.') {
  if (!error) return respaldo;
  if (typeof error === 'string') return error;
  const texto = error.message || error.errorMessage || error.code;
  if (!texto) return respaldo;
  if (/not implemented|unimplemented|no está implementado/i.test(texto)) {
    return `${texto} — este plugin necesita un dispositivo real.`;
  }
  return String(texto);
}
