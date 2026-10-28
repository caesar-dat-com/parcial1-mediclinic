// Arranque de Firebase. La configuración llega por variables de entorno de Vite
// (ver .env.example). Si no hay configuración, `hayFirebase` queda en false y los
// custom hooks usan la capa de respaldo local sin cambiar su interfaz.
import { initializeApp, getApps } from 'firebase/app';

const entorno = import.meta.env;

export const configuracionFirebase = {
  apiKey: entorno.VITE_FIREBASE_API_KEY,
  authDomain: entorno.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: entorno.VITE_FIREBASE_PROJECT_ID,
  appId: entorno.VITE_FIREBASE_APP_ID,
  databaseURL: entorno.VITE_FIREBASE_DATABASE_URL,
  storageBucket: entorno.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: entorno.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

/** true cuando el .env trae un proyecto de Firebase utilizable (Auth + Firestore). */
export const hayFirebase = Boolean(
  configuracionFirebase.apiKey && configuracionFirebase.projectId && configuracionFirebase.appId,
);

/** RealTime Database necesita además la databaseURL del proyecto. */
export const hayRealtime = hayFirebase && Boolean(configuracionFirebase.databaseURL);

/** Inicializa la app una sola vez. Devuelve null si no hay configuración. */
export function obtenerApp() {
  if (!hayFirebase) return null;
  const existentes = getApps();
  return existentes.length ? existentes[0] : initializeApp(configuracionFirebase);
}

/** Etiqueta corta para mostrar en la interfaz de dónde salen los datos. */
export const modoDatos = hayFirebase ? 'firebase' : 'local';
