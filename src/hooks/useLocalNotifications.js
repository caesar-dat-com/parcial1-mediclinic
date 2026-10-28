import { useCallback, useEffect, useRef, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';
import { mensajeError, revisarSoporte } from './soporte';

const hayNotificacionesWeb = typeof window !== 'undefined' && 'Notification' in window;

export default function useLocalNotifications() {
  const [soporte] = useState(() =>
    revisarSoporte('LocalNotifications', {
      soportaWeb: hayNotificacionesWeb,
      nota: 'La implementación web se apoya en la API de Notificaciones del navegador y programa con setTimeout: si cierras la pestaña, la notificación pendiente se pierde. Canales, acciones y avisos exactos solo existen en Android/iOS.',
    }),
  );
  const [permiso, setPermiso] = useState('desconocido');
  const [pendientes, setPendientes] = useState([]);
  const [recibidas, setRecibidas] = useState([]);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const siguienteId = useRef(1);
  const suscripciones = useRef([]);

  const revisarPermiso = useCallback(async () => {
    try {
      const estado = await LocalNotifications.checkPermissions();
      setPermiso(estado.display || 'desconocido');
      return estado.display;
    } catch (fallo) {
      setPermiso('no-disponible');
      setError(mensajeError(fallo, 'Esta plataforma no expone permisos de notificaciones locales.'));
      return 'no-disponible';
    }
  }, []);

  const pedirPermiso = useCallback(async () => {
    setError('');
    try {
      const estado = await LocalNotifications.requestPermissions();
      setPermiso(estado.display || 'desconocido');
      setAviso(`Permiso: ${estado.display}`);
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo pedir el permiso de notificaciones.'));
    }
  }, []);

  const refrescarPendientes = useCallback(async () => {
    try {
      const resultado = await LocalNotifications.getPending();
      setPendientes(
        (resultado.notifications || []).map((notificacion) => ({
          id: notificacion.id,
          titulo: notificacion.title,
          cuerpo: notificacion.body,
          cuando: notificacion.schedule?.at
            ? new Date(notificacion.schedule.at).toLocaleTimeString()
            : 'inmediata',
        })),
      );
    } catch (fallo) {
      setPendientes([]);
      setError(mensajeError(fallo, 'No se pudieron consultar las notificaciones pendientes.'));
    }
  }, []);

  const programar = useCallback(
    async (titulo, cuerpo, segundos = 10) => {
      setError('');
      setAviso('');
      const id = siguienteId.current++;
      try {
        const estado = await LocalNotifications.checkPermissions();
        if (estado.display !== 'granted') {
          const pedido = await LocalNotifications.requestPermissions();
          setPermiso(pedido.display || 'desconocido');
          if (pedido.display !== 'granted') {
            setError('El permiso de notificaciones no fue concedido, así que no se programó nada.');
            return;
          }
        }
        await LocalNotifications.schedule({
          notifications: [
            {
              id,
              title: titulo || 'Challenge 07',
              body: cuerpo || 'Notificación local programada desde el custom hook.',
              schedule: { at: new Date(Date.now() + segundos * 1000) },
            },
          ],
        });
        setAviso(`Programada #${id} para dentro de ${segundos} s`);
        await refrescarPendientes();
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudo programar la notificación local.'));
      }
    },
    [refrescarPendientes],
  );

  const cancelar = useCallback(
    async (id) => {
      setError('');
      try {
        await LocalNotifications.cancel({ notifications: [{ id }] });
        setAviso(`Cancelada #${id}`);
        await refrescarPendientes();
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudo cancelar la notificación.'));
      }
    },
    [refrescarPendientes],
  );

  const cancelarTodas = useCallback(async () => {
    setError('');
    try {
      const actuales = await LocalNotifications.getPending();
      if (actuales.notifications?.length) {
        await LocalNotifications.cancel({ notifications: actuales.notifications });
      }
      setAviso('Se cancelaron todas las notificaciones pendientes.');
      await refrescarPendientes();
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudieron cancelar las notificaciones.'));
    }
  }, [refrescarPendientes]);

  useEffect(() => {
    revisarPermiso();
    refrescarPendientes();
    (async () => {
      try {
        const recibida = await LocalNotifications.addListener(
          'localNotificationReceived',
          (notificacion) => {
            setRecibidas((previo) =>
              [`#${notificacion.id} ${notificacion.title}`, ...previo].slice(0, 5),
            );
            refrescarPendientes();
          },
        );
        const accion = await LocalNotifications.addListener(
          'localNotificationActionPerformed',
          (evento) => {
            setRecibidas((previo) =>
              [`acción ${evento.actionId} en #${evento.notification?.id}`, ...previo].slice(0, 5),
            );
          },
        );
        suscripciones.current = [recibida, accion];
      } catch {
        /* en algunas plataformas no hay eventos; el estado ya lo informa */
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
  }, [refrescarPendientes, revisarPermiso]);

  return {
    soporte,
    permiso,
    pendientes,
    recibidas,
    aviso,
    error,
    programar,
    cancelar,
    cancelarTodas,
    pedirPermiso,
    refrescarPendientes,
  };
}
