import { useCallback, useEffect, useRef, useState } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';
import { mensajeError, revisarSoporte } from './soporte';

// @capacitor/push-notifications se registra sin implementación web: cualquier
// llamada desde el navegador lanza "not implemented". El hook lo detecta antes
// de tocar el plugin y deja la página en un estado informativo en vez de
// reventar. En Android/iOS sí hace el flujo completo de registro con FCM/APNs.
export default function usePushNotifications() {
  const [soporte] = useState(() =>
    revisarSoporte('PushNotifications', {
      soportaWeb: false,
      nota: 'Las push de Capacitor necesitan FCM (Android) o APNs (iOS). En navegador no hay implementación: haría falta la Web Push API con un service worker y una clave VAPID, que es otra integración.',
    }),
  );
  const [token, setToken] = useState('');
  const [permiso, setPermiso] = useState('desconocido');
  const [registrado, setRegistrado] = useState(false);
  const [recibidas, setRecibidas] = useState([]);
  const [entregadas, setEntregadas] = useState([]);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const suscripciones = useRef([]);

  const disponible = soporte.nivel === 'completo';

  const revisarPermiso = useCallback(async () => {
    if (!disponible) {
      setPermiso('no-disponible');
      return 'no-disponible';
    }
    try {
      const estado = await PushNotifications.checkPermissions();
      setPermiso(estado.receive || 'desconocido');
      return estado.receive;
    } catch (fallo) {
      setPermiso('no-disponible');
      setError(mensajeError(fallo, 'No se pudo consultar el permiso de push.'));
      return 'no-disponible';
    }
  }, [disponible]);

  const registrar = useCallback(async () => {
    setError('');
    setAviso('');
    if (!disponible) {
      setError(
        'El plugin de push no tiene implementación web: hay que compilar la app para Android o iOS para obtener el token.',
      );
      return;
    }
    try {
      const estado = await PushNotifications.requestPermissions();
      setPermiso(estado.receive || 'desconocido');
      if (estado.receive !== 'granted') {
        setError('El usuario no concedió el permiso de notificaciones push.');
        return;
      }
      await PushNotifications.register();
      setRegistrado(true);
      setAviso('Registro enviado: esperando el token del servicio push.');
    } catch (fallo) {
      setRegistrado(false);
      setError(mensajeError(fallo, 'No se pudo registrar el dispositivo para push.'));
    }
  }, [disponible]);

  const consultarEntregadas = useCallback(async () => {
    if (!disponible) {
      setError('Sin implementación web no hay bandeja de notificaciones entregadas.');
      return;
    }
    try {
      const resultado = await PushNotifications.getDeliveredNotifications();
      setEntregadas(
        (resultado.notifications || []).map((notificacion) => ({
          id: notificacion.id,
          titulo: notificacion.title,
          cuerpo: notificacion.body,
        })),
      );
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudieron leer las notificaciones entregadas.'));
    }
  }, [disponible]);

  const limpiarEntregadas = useCallback(async () => {
    if (!disponible) {
      setError('Sin implementación web no hay nada que limpiar.');
      return;
    }
    try {
      await PushNotifications.removeAllDeliveredNotifications();
      setEntregadas([]);
      setAviso('Bandeja de push vaciada.');
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo vaciar la bandeja de push.'));
    }
  }, [disponible]);

  useEffect(() => {
    revisarPermiso();
    if (!disponible) return undefined;
    (async () => {
      try {
        const alRegistrar = await PushNotifications.addListener('registration', (dato) => {
          setToken(dato.value);
          setRegistrado(true);
          setAviso('Token recibido del servicio push.');
        });
        const alFallar = await PushNotifications.addListener('registrationError', (dato) => {
          setError(`El servicio push rechazó el registro: ${JSON.stringify(dato?.error ?? dato)}`);
          setRegistrado(false);
        });
        const alRecibir = await PushNotifications.addListener(
          'pushNotificationReceived',
          (notificacion) => {
            setRecibidas((previo) =>
              [`${notificacion.title ?? 'sin título'} · ${notificacion.body ?? ''}`, ...previo].slice(0, 5),
            );
          },
        );
        const alTocar = await PushNotifications.addListener(
          'pushNotificationActionPerformed',
          (evento) => {
            setRecibidas((previo) =>
              [`acción ${evento.actionId} en ${evento.notification?.title ?? 'push'}`, ...previo].slice(0, 5),
            );
          },
        );
        suscripciones.current = [alRegistrar, alFallar, alRecibir, alTocar];
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudieron registrar los listeners de push.'));
      }
    })();
    return () => {
      const actuales = suscripciones.current;
      suscripciones.current = [];
      actuales.forEach((suscripcion) => {
        try {
          suscripcion.remove();
        } catch {
          /* ignorado */
        }
      });
    };
  }, [disponible, revisarPermiso]);

  return {
    soporte,
    disponible,
    token,
    permiso,
    registrado,
    recibidas,
    entregadas,
    aviso,
    error,
    registrar,
    consultarEntregadas,
    limpiarEntregadas,
  };
}
