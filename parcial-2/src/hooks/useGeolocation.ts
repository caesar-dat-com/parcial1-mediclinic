import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation, type Position } from '@capacitor/geolocation';

type Opciones = { seguir?: boolean };

/** Ubicación actual, con opción de seguimiento continuo (watchPosition). */
export function useGeolocation({ seguir = false }: Opciones = {}) {
  const [posicion, setPosicion] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const watchId = useRef<string | null>(null);

  const ubicar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      await Geolocation.requestPermissions();
      const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true });
      setPosicion(pos);
      return pos;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No pude obtener la ubicación');
      return null;
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (!seguir) return;
    let activo = true;
    Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
      if (!activo) return;
      if (err) setError(err.message);
      else if (pos) setPosicion(pos);
    }).then((id) => {
      if (activo) watchId.current = id;
      else Geolocation.clearWatch({ id });
    });
    return () => {
      activo = false;
      if (watchId.current) Geolocation.clearWatch({ id: watchId.current });
    };
  }, [seguir]);

  const coords = posicion
    ? { lat: posicion.coords.latitude, lng: posicion.coords.longitude,
        precision: posicion.coords.accuracy }
    : null;

  return { posicion, coords, error, cargando, ubicar };
}
