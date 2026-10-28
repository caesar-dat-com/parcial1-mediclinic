// Contexto de sesión: deja el custom hook de autenticación disponible en toda
// la app sin repetir llamadas a Firebase Auth en cada página.
import { createContext, useContext } from 'react';
import useAuth from '../hooks/useAuth';

const SesionContext = createContext(null);

export function SesionProvider({ children }) {
  const sesion = useAuth();
  return <SesionContext.Provider value={sesion}>{children}</SesionContext.Provider>;
}

export function useSesion() {
  const sesion = useContext(SesionContext);
  if (!sesion) throw new Error('useSesion se usa dentro de <SesionProvider>');
  return sesion;
}
