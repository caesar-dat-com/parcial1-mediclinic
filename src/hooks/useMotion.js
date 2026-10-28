import { useCallback, useEffect, useRef, useState } from 'react';
import { Motion } from '@capacitor/motion';
import { mensajeError, revisarSoporte } from './soporte';

const hayEventosWeb =
  typeof window !== 'undefined' &&
  ('DeviceMotionEvent' in window || 'DeviceOrientationEvent' in window);

function redondear(valor) {
  return typeof valor === 'number' ? Number(valor.toFixed(3)) : null;
}

export default function useMotion() {
  const [soporte] = useState(() =>
    revisarSoporte('Motion', {
      soportaWeb: hayEventosWeb,
      nota: 'El plugin web escucha devicemotion y deviceorientation. Un navegador de escritorio declara esos eventos pero no tiene sensores, así que no llega ningún dato: hace falta un teléfono (en iOS además hay que aceptar el permiso).',
    }),
  );
  const [aceleracion, setAceleracion] = useState(null);
  const [orientacion, setOrientacion] = useState(null);
  const [eventos, setEventos] = useState({ accel: 0, orientation: 0 });
  const [escuchando, setEscuchando] = useState(false);
  const [permiso, setPermiso] = useState('no-requerido');
  const [error, setError] = useState('');
  const suscripciones = useRef([]);
  const ultimoPintado = useRef(0);

  const soltar = useCallback(async () => {
    const actuales = suscripciones.current;
    suscripciones.current = [];
    setEscuchando(false);
    await Promise.all(
      actuales.map(async (suscripcion) => {
        try {
          await suscripcion.remove();
        } catch {
          /* al desmontar no importa si ya se fue */
        }
      }),
    );
  }, []);

  // iOS 13+ exige pedir permiso con un gesto del usuario. Se registra la
  // respuesta pero no se aborta: los listeners se suscriben igual y la página
  // muestra el permiso y el contador de eventos, que es la señal honesta de si
  // de verdad está llegando algo.
  const pedirPermisoWeb = useCallback(async () => {
    if (typeof window === 'undefined') return 'no-requerido';
    const motion = window.DeviceMotionEvent;
    const orient = window.DeviceOrientationEvent;
    const dueño = typeof motion?.requestPermission === 'function' ? motion : orient;
    if (typeof dueño?.requestPermission !== 'function') {
      setPermiso('no-requerido');
      return 'no-requerido';
    }
    try {
      const respuesta = await dueño.requestPermission();
      setPermiso(respuesta);
      if (respuesta !== 'granted') {
        setError(
          `El permiso de movimiento quedó en "${respuesta}": los listeners se registran, pero no llegarán eventos hasta que se conceda.`,
        );
      }
      return respuesta;
    } catch (fallo) {
      setPermiso('denegado');
      setError(mensajeError(fallo, 'El navegador rechazó el permiso de movimiento.'));
      return 'denegado';
    }
  }, []);

  const escuchar = useCallback(async () => {
    if (suscripciones.current.length) {
      await soltar();
      return;
    }
    setError('');
    await pedirPermisoWeb();
    try {
      const acelerometro = await Motion.addListener('accel', (dato) => {
        setEventos((previo) => ({ ...previo, accel: previo.accel + 1 }));
        const ahora = Date.now();
        if (ahora - ultimoPintado.current < 250) return;
        ultimoPintado.current = ahora;
        setAceleracion({
          x: redondear(dato?.acceleration?.x),
          y: redondear(dato?.acceleration?.y),
          z: redondear(dato?.acceleration?.z),
          xConGravedad: redondear(dato?.accelerationIncludingGravity?.x),
          yConGravedad: redondear(dato?.accelerationIncludingGravity?.y),
          zConGravedad: redondear(dato?.accelerationIncludingGravity?.z),
          intervalo: dato?.interval ?? null,
        });
      });
      const giro = await Motion.addListener('orientation', (dato) => {
        setEventos((previo) => ({ ...previo, orientation: previo.orientation + 1 }));
        setOrientacion({
          alpha: redondear(dato?.alpha),
          beta: redondear(dato?.beta),
          gamma: redondear(dato?.gamma),
        });
      });
      suscripciones.current = [acelerometro, giro];
      setEscuchando(true);
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudieron registrar los listeners de Motion.'));
      setEscuchando(false);
    }
  }, [pedirPermisoWeb, soltar]);

  const reiniciar = useCallback(() => {
    setAceleracion(null);
    setOrientacion(null);
    setEventos({ accel: 0, orientation: 0 });
    setError('');
  }, []);

  useEffect(
    () => () => {
      const actuales = suscripciones.current;
      suscripciones.current = [];
      actuales.forEach((suscripcion) => {
        try {
          suscripcion.remove();
        } catch {
          /* ignorado */
        }
      });
    },
    [],
  );

  return {
    soporte,
    aceleracion,
    orientacion,
    eventos,
    escuchando,
    permiso,
    error,
    escuchar,
    detener: soltar,
    reiniciar,
  };
}
