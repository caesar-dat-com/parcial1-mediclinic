// Capa de respaldo sobre localStorage.
//
// Expone las mismas operaciones que usan los custom hooks de Firestore y de
// RealTime Database (suscribir / agregar / actualizar / eliminar), de modo que
// cuando el .env trae un proyecto de Firebase no hay que tocar ni los hooks por
// fuera del `if (!hayFirebase)` ni los componentes.
//
// Esto NO es Firebase: es almacenamiento del navegador para poder demostrar la
// app y correr las pruebas sin un proyecto real.

const PREFIJO = 'challenge06';
const CLAVE_SESION = `${PREFIJO}_sesion`;
const oyentes = new Map();

function clave(coleccion) {
  return `${PREFIJO}_${coleccion}`;
}

function leer(coleccion) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave(coleccion)) ?? '[]');
    return Array.isArray(datos) ? datos.filter((fila) => fila && typeof fila.id === 'string') : [];
  } catch {
    return [];
  }
}

function avisar(coleccion, filas) {
  (oyentes.get(coleccion) ?? new Set()).forEach((oyente) => oyente(filas));
}

function escribir(coleccion, filas) {
  localStorage.setItem(clave(coleccion), JSON.stringify(filas));
  avisar(coleccion, filas);
}

/** Equivalente a onSnapshot/onValue: avisa ya y en cada cambio. Devuelve la baja. */
export function suscribir(coleccion, oyente) {
  if (!oyentes.has(coleccion)) oyentes.set(coleccion, new Set());
  oyentes.get(coleccion).add(oyente);
  oyente(leer(coleccion));
  return () => {
    oyentes.get(coleccion)?.delete(oyente);
  };
}

/** Equivalente a addDoc/push+set. Devuelve el id generado. */
export function agregar(coleccion, datos) {
  const fila = { id: crypto.randomUUID(), ...datos };
  escribir(coleccion, [...leer(coleccion), fila]);
  return fila.id;
}

/** Equivalente a updateDoc/update. */
export function actualizar(coleccion, id, cambios) {
  escribir(
    coleccion,
    leer(coleccion).map((fila) => (fila.id === id ? { ...fila, ...cambios } : fila)),
  );
}

/** Equivalente a deleteDoc/remove. */
export function eliminar(coleccion, id) {
  escribir(
    coleccion,
    leer(coleccion).filter((fila) => fila.id !== id),
  );
}

/* --- sesión de respaldo para cuando tampoco hay Firebase Auth --- */

export function leerSesion() {
  try {
    const sesion = JSON.parse(localStorage.getItem(CLAVE_SESION) ?? 'null');
    return sesion && typeof sesion.email === 'string' ? sesion : null;
  } catch {
    return null;
  }
}

export function guardarSesion(sesion) {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
}

export function borrarSesion() {
  localStorage.removeItem(CLAVE_SESION);
}
