// Custom hook con TODA la logica de Firebase Authentication. Los componentes no importan
// nada de 'firebase/auth': solo consumen lo que este hook publica a traves del AuthContext.
import { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth, hayFirebase } from '../firebase/config';
import { authLocal } from '../firebase/local';

const MENSAJES = {
  'auth/invalid-email': 'El correo no tiene un formato valido.',
  'auth/missing-password': 'Escribe tu contraseña.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta. Inicia sesion.',
  'auth/user-not-found': 'No encontramos una cuenta con ese correo.',
  'auth/wrong-password': 'El correo o la contraseña no coinciden.',
  'auth/invalid-credential': 'El correo o la contraseña no coinciden.',
  'auth/too-many-requests': 'Demasiados intentos. Espera un momento.',
  'auth/network-request-failed': 'Sin conexion con Firebase. Revisa tu red.',
};

function mensajeDe(error) {
  return MENSAJES[error?.code] ?? error?.message ?? 'No se pudo completar la operacion.';
}

function normalizar(cuenta) {
  if (!cuenta) return null;
  return { uid: cuenta.uid, email: cuenta.email };
}

export default function useAuthFirebase() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // onAuthStateChanged mantiene la sesion al recargar la app.
  useEffect(() => {
    if (hayFirebase) {
      return onAuthStateChanged(auth, (cuenta) => {
        setUsuario(normalizar(cuenta));
        setCargando(false);
      });
    }
    return authLocal.onAuthStateChanged((cuenta) => {
      setUsuario(normalizar(cuenta));
      setCargando(false);
    });
  }, []);

  const limpiarError = useCallback(() => setError(''), []);

  const registrar = useCallback(async (email, password) => {
    setError('');
    try {
      if (hayFirebase) {
        const credencial = await createUserWithEmailAndPassword(auth, email.trim(), password);
        setUsuario(normalizar(credencial.user));
      } else {
        setUsuario(normalizar(await authLocal.createUser(email, password)));
      }
      return true;
    } catch (fallo) {
      setError(mensajeDe(fallo));
      return false;
    }
  }, []);

  const entrar = useCallback(async (email, password) => {
    setError('');
    try {
      if (hayFirebase) {
        const credencial = await signInWithEmailAndPassword(auth, email.trim(), password);
        setUsuario(normalizar(credencial.user));
      } else {
        setUsuario(normalizar(await authLocal.signIn(email, password)));
      }
      return true;
    } catch (fallo) {
      setError(mensajeDe(fallo));
      return false;
    }
  }, []);

  const salir = useCallback(async () => {
    setError('');
    try {
      if (hayFirebase) await signOut(auth);
      else await authLocal.signOut();
      setUsuario(null);
      return true;
    } catch (fallo) {
      setError(mensajeDe(fallo));
      return false;
    }
  }, []);

  return {
    usuario,
    cargando,
    error,
    registrar,
    entrar,
    salir,
    limpiarError,
    usandoFirebase: hayFirebase,
  };
}
