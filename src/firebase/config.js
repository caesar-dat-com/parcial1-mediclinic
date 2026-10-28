// Inicializacion del SDK modular de Firebase a partir de las variables VITE_* (ver .env.example).
// Si no hay configuracion no se llama a initializeApp, asi la app arranca sin red y los custom
// hooks pueden usar el respaldo local de ./local.js detras de la misma interfaz.
import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const configuracion = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const hayFirebase = Boolean(
  configuracion.apiKey && configuracion.projectId && configuracion.appId,
);

let app = null;
let auth = null;
let db = null;

if (hayFirebase) {
  app = getApps().length ? getApps()[0] : initializeApp(configuracion);
  auth = getAuth(app);
  db = getFirestore(app);
}

export { app, auth, db, configuracion };
