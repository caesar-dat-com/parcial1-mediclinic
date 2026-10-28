// Contexto de red: un solo oyente de @capacitor/network para toda la app.
import { createContext, useContext } from 'react';
import useNetwork from '../hooks/useNetwork';

const RedContext = createContext(null);

export function RedProvider({ children }) {
  const red = useNetwork();
  return <RedContext.Provider value={red}>{children}</RedContext.Provider>;
}

export function useRed() {
  const red = useContext(RedContext);
  if (!red) throw new Error('useRed se usa dentro de <RedProvider>');
  return red;
}
