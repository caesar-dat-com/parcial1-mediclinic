import { useCallback, useEffect, useRef, useState } from 'react';
import { Geolocation } from '@capacitor/geolocation';
import { mensajeError, revisarSoporte } from './soporte';

const hayRespaldoWeb = typeof navigator !== 'undefined' && 'geolocation' in navigator;

function formatear(posicion) {
  if (!posicion || !posicion.coords) return null;
  const { latitude, longitude, accuracy, altitude, speed } = posicion.coords;
  return {
    latitud: Number(latitude).toFixed(6),
    longitud: Number(longitude).toFixed(6),
    precision: accuracy == null ? '—' : `${Math.round(accuracy)} m`,
    altitud: altitude == null ? '—' : `${Math.round(altitude)} m`,
    velocidad: speed == null ? '—' : `${speed} m/s`,
    momento: new Date(posicion.timestamp || Date.now()).toLocaleTimeString(),
  };
}

export default function useGeolocation() {
  const [soporte] = useState(() =>
    revisarSoporte('Geolocation', {
      soportaWeb: hayRespaldoWeb,
      nota: 'En navegador se resuelve con navigator.geolocation y hace falta dar permiso; la precisión es peor que con el GPS del teléfono.',
    }),
  );
  const [posicion, setPosicion] = useState(null);
  const [permiso, setPermiso] = useState('desconocido');
  const [observando, setObservando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const observador = useRef(null);

  const revisarPermiso = useCallback(async () => {
    try {
      const estado = await Geolocation.checkPermissions();
      setPermiso(estado.location || 'desconocido');
      return estado.location;
    } catch (fallo) {
      setPermiso('desconocido');
      setError(mensajeError(fallo, 'No se pudo consultar el permiso de ubicación.'));
      return 'desconocido';
    }
  }, []);

  const pedirPermiso = useCallback(async () => {
    setError('');
    try {
      const estado = await Geolocation.requestPermissions();
      setPermiso(estado.location || 'desconocido');
    } catch (fallo) {
      setError(mensajeError(fallo, 'El navegador no permitió pedir el permiso de ubicación.'));
    }
  }, []);

  const leerPosicion = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const lectura = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        timeout: 8000,
      });
      setPosicion(formatear(lectura));
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo obtener la posición actual.'));
    } finally {
      setCargando(false);
    }
  }, []);

  const detenerObservacion = useCallback(async () => {
    const id = observador.current;
    observador.current = null;
    setObservando(false);
    if (!id) return;
    try {
      await Geolocation.clearWatch({ id });
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo detener el seguimiento.'));
    }
  }, []);

  const observar = useCallback(async () => {
    if (observador.current) {
      await detenerObservacion();
      return;
    }
    setError('');
    try {
      const id = await Geolocation.watchPosition(
        { enableHighAccuracy: false, timeout: 8000 },
        (lectura, fallo) => {
          if (fallo) {
            setError(mensajeError(fallo, 'El seguimiento de ubicación falló.'));
            return;
          }
          setPosicion(formatear(lectura));
        },
      );
      observador.current = id;
      setObservando(true);
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo iniciar el seguimiento de ubicación.'));
      setObservando(false);
    }
  }, [detenerObservacion]);

  useEffect(() => {
    revisarPermiso();
    return () => {
      const id = observador.current;
      observador.current = null;
      if (id) Geolocation.clearWatch({ id }).catch(() => {});
    };
  }, [revisarPermiso]);

  return {
    soporte,
    posicion,
    permiso,
    observando,
    cargando,
    error,
    leerPosicion,
    observar,
    detenerObservacion,
    pedirPermiso,
  };
}
