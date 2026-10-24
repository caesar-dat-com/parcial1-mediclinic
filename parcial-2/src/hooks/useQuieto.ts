import { useEffect, useRef, useState } from 'react';
import { useMotion } from './useMotion';

const GRAVEDAD = 9.81;
const TOLERANCIA = 1.2; // m/s² de margen sobre la gravedad para considerar que no se mueve

/**
 * Cuenta cuántos segundos lleva el equipo quieto, leyendo el acelerómetro.
 * Si el usuario se mueve, el contador vuelve a cero. No bloquea la pantalla.
 */
export function useQuieto(activo: boolean, segundosMeta = 10) {
  const { magnitud } = useMotion(activo);
  const [segundos, setSegundos] = useState(0);
  const [logrado, setLogrado] = useState(false);
  const quietoDesde = useRef<number | null>(null);

  useEffect(() => {
    if (!activo) {
      setSegundos(0);
      quietoDesde.current = null;
      return;
    }
    const temporizador = setInterval(() => {
      // sin sensor (navegador de escritorio) la magnitud es 0: se toma como quieto
      const enReposo = magnitud === 0 || Math.abs(magnitud - GRAVEDAD) < TOLERANCIA;
      if (!enReposo) {
        quietoDesde.current = null;
        setSegundos(0);
        return;
      }
      if (quietoDesde.current == null) quietoDesde.current = Date.now();
      const transcurrido = Math.floor((Date.now() - quietoDesde.current) / 1000);
      setSegundos(transcurrido);
      if (transcurrido >= segundosMeta) setLogrado(true);
    }, 500);
    return () => clearInterval(temporizador);
  }, [activo, magnitud, segundosMeta]);

  return { segundos, logrado, meta: segundosMeta, reiniciar: () => { setLogrado(false); setSegundos(0); quietoDesde.current = null; } };
}
