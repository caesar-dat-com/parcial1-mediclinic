import { useCallback, useEffect, useState } from 'react';
import { LocalNotifications } from '@capacitor/local-notifications';

/** Notificaciones locales: pedir permiso y programarlas. */
export function useLocalNotifications() {
  const [permitido, setPermitido] = useState(false);

  useEffect(() => {
    LocalNotifications.checkPermissions()
      .then((p) => setPermitido(p.display === 'granted'))
      .catch(() => setPermitido(false));
  }, []);

  const pedirPermiso = useCallback(async () => {
    const p = await LocalNotifications.requestPermissions();
    const ok = p.display === 'granted';
    setPermitido(ok);
    return ok;
  }, []);

  const notificar = useCallback(
    async (titulo: string, cuerpo: string, segundos = 0) => {
      if (!permitido && !(await pedirPermiso())) return false;
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now() % 100000,
            title: titulo,
            body: cuerpo,
            schedule: segundos > 0 ? { at: new Date(Date.now() + segundos * 1000) } : undefined,
          },
        ],
      });
      return true;
    },
    [permitido, pedirPermiso],
  );

  return { permitido, pedirPermiso, notificar };
}
