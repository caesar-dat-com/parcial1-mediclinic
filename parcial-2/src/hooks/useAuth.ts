import { useCallback, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut,
} from 'firebase/auth';
import { auth, hayFirebase } from '../lib/firebase';
import {
  entrarCuentaLocal, guardarUsuario, leerUsuario, registrarCuentaLocal, type Usuario,
} from '../lib/almacen';

/**
 * Sesión del usuario. Usa Firebase Auth cuando está configurado; si no, cuentas
 * locales con la misma interfaz, para que la app sirva igual sin credenciales.
 */
export function useAuth() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (hayFirebase && auth) {
      return onAuthStateChanged(auth, (u) => {
        setUsuario(u ? { uid: u.uid, email: u.email ?? '' } : null);
        setCargando(false);
      });
    }
    setUsuario(leerUsuario());
    setCargando(false);
  }, []);

  const registrar = useCallback(async (email: string, clave: string) => {
    setError(null);
    try {
      if (hayFirebase && auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, clave);
        return { uid: cred.user.uid, email: cred.user.email ?? email };
      }
      const u = registrarCuentaLocal(email, clave);
      guardarUsuario(u);
      setUsuario(u);
      return u;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo registrar');
      return null;
    }
  }, []);

  const entrar = useCallback(async (email: string, clave: string) => {
    setError(null);
    try {
      if (hayFirebase && auth) {
        const cred = await signInWithEmailAndPassword(auth, email, clave);
        return { uid: cred.user.uid, email: cred.user.email ?? email };
      }
      const u = entrarCuentaLocal(email, clave);
      guardarUsuario(u);
      setUsuario(u);
      return u;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se pudo entrar');
      return null;
    }
  }, []);

  const salir = useCallback(async () => {
    if (hayFirebase && auth) await signOut(auth);
    guardarUsuario(null);
    setUsuario(null);
  }, []);

  return { usuario, cargando, error, registrar, entrar, salir, conFirebase: hayFirebase };
}
