// Context #1: login y registro. Envuelve el custom hook de Firebase Authentication para que
// el estado de la sesion viaje por toda la app sin pasar props de pagina en pagina.
import { createContext } from 'react';
import useAuthFirebase from '../hooks/useAuthFirebase';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const valor = useAuthFirebase();
  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}
