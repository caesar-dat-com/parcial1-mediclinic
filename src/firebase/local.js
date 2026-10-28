// Respaldo local que imita el trozo de Firebase que usa la app (Authentication y la coleccion
// de tareas de Firestore) guardando todo en localStorage. Solo se usa cuando no hay .env con
// las claves del proyecto: asi la app se puede revisar y probar sin credenciales.
// Las firmas son las mismas que consumen los custom hooks, por eso cambiar a Firebase real
// no toca ni las paginas ni los contextos.

const CLAVE_USUARIOS = 'challenge05_usuarios';
const CLAVE_SESION = 'challenge05_sesion';
const CLAVE_TAREAS = 'challenge05_tareas';

function leer(clave, porDefecto) {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) ?? 'null');
    return datos ?? porDefecto;
  } catch {
    return porDefecto;
  }
}

function guardar(clave, valor) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

function nuevoId() {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fallo(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// --- Authentication ---------------------------------------------------------

const oyentesAuth = new Set();

function sesionActual() {
  return leer(CLAVE_SESION, null);
}

function avisarAuth() {
  const usuario = sesionActual();
  oyentesAuth.forEach((oyente) => oyente(usuario));
}

export const authLocal = {
  usuarioActual() {
    return sesionActual();
  },
  onAuthStateChanged(oyente) {
    oyentesAuth.add(oyente);
    // Firebase tambien entrega el estado inicial de forma asincrona.
    Promise.resolve().then(() => oyente(sesionActual()));
    return () => oyentesAuth.delete(oyente);
  },
  async createUser(email, password) {
    const correo = email.trim().toLowerCase();
    if (password.length < 6) throw fallo('auth/weak-password', 'Contraseña muy corta.');
    const usuarios = leer(CLAVE_USUARIOS, []);
    if (usuarios.some((u) => u.email === correo)) {
      throw fallo('auth/email-already-in-use', 'Ese correo ya tiene cuenta.');
    }
    const usuario = { uid: nuevoId(), email: correo, password };
    guardar(CLAVE_USUARIOS, [...usuarios, usuario]);
    const sesion = { uid: usuario.uid, email: usuario.email };
    guardar(CLAVE_SESION, sesion);
    avisarAuth();
    return sesion;
  },
  async signIn(email, password) {
    const correo = email.trim().toLowerCase();
    const usuarios = leer(CLAVE_USUARIOS, []);
    const usuario = usuarios.find((u) => u.email === correo);
    if (!usuario) throw fallo('auth/user-not-found', 'No hay cuenta con ese correo.');
    if (usuario.password !== password) {
      throw fallo('auth/wrong-password', 'La contraseña no coincide.');
    }
    const sesion = { uid: usuario.uid, email: usuario.email };
    guardar(CLAVE_SESION, sesion);
    avisarAuth();
    return sesion;
  },
  async signOut() {
    localStorage.removeItem(CLAVE_SESION);
    avisarAuth();
  },
};

// --- Firestore (coleccion de tareas por usuario) ----------------------------

const oyentesTareas = new Set();

function todasLasTareas() {
  const datos = leer(CLAVE_TAREAS, []);
  return Array.isArray(datos) ? datos : [];
}

function tareasDe(uid) {
  return todasLasTareas()
    .filter((tarea) => tarea.uid === uid)
    .sort((a, b) => (b.creada ?? 0) - (a.creada ?? 0));
}

function avisarTareas() {
  oyentesTareas.forEach(({ uid, oyente }) => oyente(tareasDe(uid)));
}

export const tareasLocal = {
  subscribe(uid, oyente) {
    const registro = { uid, oyente };
    oyentesTareas.add(registro);
    Promise.resolve().then(() => oyente(tareasDe(uid)));
    return () => oyentesTareas.delete(registro);
  },
  async add(uid, datos) {
    const tarea = {
      id: nuevoId(),
      uid,
      titulo: datos.titulo,
      detalle: datos.detalle ?? '',
      completa: false,
      creada: Date.now(),
    };
    guardar(CLAVE_TAREAS, [...todasLasTareas(), tarea]);
    avisarTareas();
    return tarea.id;
  },
  async update(uid, id, cambios) {
    const tareas = todasLasTareas().map((tarea) =>
      tarea.id === id && tarea.uid === uid ? { ...tarea, ...cambios } : tarea,
    );
    guardar(CLAVE_TAREAS, tareas);
    avisarTareas();
  },
  async remove(uid, id) {
    guardar(
      CLAVE_TAREAS,
      todasLasTareas().filter((tarea) => !(tarea.id === id && tarea.uid === uid)),
    );
    avisarTareas();
  },
  async get(uid, id) {
    return tareasDe(uid).find((tarea) => tarea.id === id) ?? null;
  },
};
