import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

// Atajo para leer el context de autenticacion desde cualquier pagina o componente.
export default function useAuth() {
  const valor = useContext(AuthContext);
  if (!valor) throw new Error('useAuth se debe usar dentro de <AuthProvider>.');
  return valor;
}
