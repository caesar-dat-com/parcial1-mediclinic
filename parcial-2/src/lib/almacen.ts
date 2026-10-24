/**
 * Persistencia local en localStorage con el formato que pide el enunciado:
 * { "points": 120, "missions": [ { "id": 1, "completed": true } ] }
 * Es el respaldo cuando no hay internet o no hay Firebase configurado.
 */
export type EstadoMision = { id: number; completed: boolean };
export type Progreso = { points: number; missions: EstadoMision[] };

export type Usuario = { uid: string; email: string };

const CLAVE_PROGRESO = 'misiones:progreso';
const CLAVE_USUARIO = 'misiones:usuario';
const CLAVE_CUENTAS = 'misiones:cuentas';
const CLAVE_RANKING = 'misiones:ranking';

export const PROGRESO_VACIO: Progreso = {
  points: 0,
  missions: [
    { id: 1, completed: false },
    { id: 2, completed: false },
    { id: 3, completed: false },
  ],
};

function leer<T>(clave: string, porDefecto: T): T {
  try {
    const crudo = localStorage.getItem(clave);
    return crudo ? (JSON.parse(crudo) as T) : porDefecto;
  } catch {
    return porDefecto;
  }
}

function escribir(clave: string, valor: unknown) {
  localStorage.setItem(clave, JSON.stringify(valor));
}

/* ---- progreso por usuario ---- */

export function leerProgreso(uid: string): Progreso {
  const todos = leer<Record<string, Progreso>>(CLAVE_PROGRESO, {});
  return todos[uid] ?? PROGRESO_VACIO;
}

export function guardarProgreso(uid: string, progreso: Progreso) {
  const todos = leer<Record<string, Progreso>>(CLAVE_PROGRESO, {});
  todos[uid] = progreso;
  escribir(CLAVE_PROGRESO, todos);
}

/* ---- sesión y cuentas locales (respaldo de Firebase Auth) ---- */

export function leerUsuario(): Usuario | null {
  return leer<Usuario | null>(CLAVE_USUARIO, null);
}

export function guardarUsuario(u: Usuario | null) {
  if (u) escribir(CLAVE_USUARIO, u);
  else localStorage.removeItem(CLAVE_USUARIO);
}

type Cuenta = { email: string; clave: string; uid: string };

export function registrarCuentaLocal(email: string, clave: string): Usuario {
  const cuentas = leer<Cuenta[]>(CLAVE_CUENTAS, []);
  if (cuentas.some((c) => c.email === email)) throw new Error('Ese correo ya está registrado');
  const uid = `local-${Date.now()}`;
  cuentas.push({ email, clave, uid });
  escribir(CLAVE_CUENTAS, cuentas);
  return { uid, email };
}

export function entrarCuentaLocal(email: string, clave: string): Usuario {
  const cuentas = leer<Cuenta[]>(CLAVE_CUENTAS, []);
  const c = cuentas.find((x) => x.email === email);
  if (!c) throw new Error('No existe una cuenta con ese correo');
  if (c.clave !== clave) throw new Error('Contraseña incorrecta');
  return { uid: c.uid, email: c.email };
}

/* ---- ranking ---- */

export type FilaRanking = { uid: string; email: string; points: number };

/** Otros jugadores con los que se compara el usuario. */
const COMPETENCIA: FilaRanking[] = [
  { uid: 'r1', email: 'laura.mejia@uao.edu.co', points: 90 },
  { uid: 'r2', email: 'andres.rojas@uao.edu.co', points: 70 },
  { uid: 'r3', email: 'sofia.castro@uao.edu.co', points: 50 },
  { uid: 'r4', email: 'julian.vera@uao.edu.co', points: 30 },
];

export function leerRanking(): FilaRanking[] {
  return leer<FilaRanking[]>(CLAVE_RANKING, COMPETENCIA);
}

/** Mete al usuario en la tabla y devuelve el top 5 ordenado. */
export function rankingCon(usuario: Usuario, points: number): FilaRanking[] {
  const otros = leerRanking().filter((f) => f.uid !== usuario.uid);
  const tabla = [...otros, { uid: usuario.uid, email: usuario.email, points }];
  return tabla.sort((a, b) => b.points - a.points).slice(0, 5);
}
