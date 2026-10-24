import { useCallback, useEffect, useRef, useState } from 'react';
import { useGeolocation } from './useGeolocation';

/** Distancia en metros entre dos coordenadas (fórmula de haversine). */
export function distanciaEnMetros(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
) {
  const R = 6371000;
  const rad = Math.PI / 180;
  const dLat = (b.lat - a.lat) * rad;
  const dLng = (b.lng - a.lng) * rad;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/**
 * Mide cuánto se ha alejado el usuario del punto donde empezó.
 * Guarda el máximo alcanzado para que la misión no se "descomplete" al volver.
 */
export function useDistancia() {
  const { coords, error, ubicar } = useGeolocation({ seguir: true });
  const origen = useRef<{ lat: number; lng: number } | null>(null);
  const [recorrido, setRecorrido] = useState(0);

  useEffect(() => {
    if (!coords) return;
    if (!origen.current) {
      origen.current = { lat: coords.lat, lng: coords.lng };
      return;
    }
    const d = distanciaEnMetros(origen.current, coords);
    setRecorrido((previo) => (d > previo ? d : previo));
  }, [coords]);

  const reiniciar = useCallback(() => {
    origen.current = coords ? { lat: coords.lat, lng: coords.lng } : null;
    setRecorrido(0);
  }, [coords]);

  return { coords, origen: origen.current, recorrido, error, ubicar, reiniciar };
}
