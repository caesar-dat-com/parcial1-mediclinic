// Custom hook de autenticación. Usa Firebase Auth cuando hay proyecto
// configurado; si no, valida la cuenta de práctica del curso y guarda la sesión
// en localStorage. Los componentes siempre ven la misma interfaz.
import { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { hayFirebase, obtenerApp } from '../services/firebase';
import { borrarSesion, guardarSesion, leerSesion } from '../services/respaldoLocal';

export const CUENTA_DEMO = { email: 'user@mail.com', password: '123' };

const MENSAJES = {
  'auth/invalid-email': 'El correo no tiene un formato válido.',
  'auth/invalid-credential': 'El correo o la contraseña no coinciden. Intenta de nuevo.',
  'auth/wrong-password': 'El correo o la contraseña no coinciden. Intenta de nuevo.',
  'auth/user-not-found': 'El correo o la contraseña no coinciden. Intenta de nuevo.',
  'auth/email-already-in-use': 'Ese correo ya tiene una cuenta.',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
  'auth/network-request-failed': 'No hay conexión para hablar con Firebase.',
};

function traducir(codigo) {
  return MENSAJES[codigo] ?? 'No se pudo completar la operación. Intenta de nuevo.';
}

export default function useAuth() {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hayFirebase) {
      setUsuario(leerSesion());
      setCargando(false);
      return undefined;
    }
    return onAuthStateChanged(getAuth(obtenerApp()), (cuenta) => {
      setUsuario(cuenta ? { uid: cuenta.uid, email: cuenta.email } : null);
      setCargando(false);
    });
  }, []);

  const entrar = useCallback(async (email, password) => {
    setError('');
    const correo = (email ?? '').trim();
    if (!correo || !password) {
      setError('Escribe el correo y la contraseña.');
      return false;
    }
    if (!hayFirebase) {
      if (correo.toLowerCase() !== CUENTA_DEMO.email || password !== CUENTA_DEMO.password) {
        setError('El correo o la contraseña no coinciden. Intenta de nuevo.');
        return false;
      }
      const sesion = { uid: 'local-demo', email: CUENTA_DEMO.email };
      guardarSesion(sesion);
      setUsuario(sesion);
      return true;
    }
    try {
      await signInWithEmailAndPassword(getAuth(obtenerApp()), correo, password);
      return true;
    } catch (fallo) {
      setError(traducir(fallo?.code));
      return false;
    }
  }, []);

  const registrar = useCallback(async (email, password) => {
    setError('');
    if (!hayFirebase) {
      setError('El registro necesita un proyecto de Firebase configurado.');
      return false;
    }
    try {
      await createUserWithEmailAndPassword(getAuth(obtenerApp()), (email ?? '').trim(), password);
      return true;
    } catch (fallo) {
      setError(traducir(fallo?.code));
      return false;
    }
  }, []);

  const salir = useCallback(async () => {
    setError('');
    if (!hayFirebase) {
      borrarSesion();
      setUsuario(null);
      return;
    }
    await signOut(getAuth(obtenerApp()));
  }, []);

  return {
    usuario,
    cargando,
    error,
    entrar,
    registrar,
    salir,
    logueado: Boolean(usuario),
    modo: hayFirebase ? 'firebase' : 'local',
  };
}
