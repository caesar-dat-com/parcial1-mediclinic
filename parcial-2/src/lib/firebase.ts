import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Las llaves van en .env (ver .env.example). Si no están, la app trabaja solo
// con almacenamiento local y lo avisa en pantalla.
const config = {
  apiKey: import.meta.env.VITE_FB_API_KEY,
  authDomain: import.meta.env.VITE_FB_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FB_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FB_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FB_SENDER_ID,
  appId: import.meta.env.VITE_FB_APP_ID,
};

export const hayFirebase = Boolean(config.apiKey && config.projectId);

let app: FirebaseApp | null = null;
let authRef: Auth | null = null;
let dbRef: Firestore | null = null;

if (hayFirebase) {
  app = initializeApp(config);
  authRef = getAuth(app);
  dbRef = getFirestore(app);
}

export const auth = authRef;
export const db = dbRef;
