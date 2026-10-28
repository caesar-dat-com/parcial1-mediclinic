import { useCallback, useState } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { mensajeError, revisarSoporte } from './soporte';

const hayVibracionWeb = typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function';

export default function useHaptics() {
  const [soporte] = useState(() =>
    revisarSoporte('Haptics', {
      soportaWeb: hayVibracionWeb,
      nota: 'La implementación web solo traduce a navigator.vibrate, que existe en Android/Chrome pero no en un escritorio ni en Safari. El motor táctil fino (impact y selection) es exclusivo del dispositivo.',
    }),
  );
  const [ultima, setUltima] = useState('');
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState('');
  const [seleccionAbierta, setSeleccionAbierta] = useState(false);

  const ejecutar = useCallback(async (etiqueta, accion) => {
    setError('');
    try {
      await accion();
      setUltima(etiqueta);
      setHistorial((previo) => [`${etiqueta} · ${new Date().toLocaleTimeString()}`, ...previo].slice(0, 6));
    } catch (fallo) {
      setUltima(`${etiqueta} (no ejecutada)`);
      setError(mensajeError(fallo, `"${etiqueta}" no está disponible en esta plataforma.`));
    }
  }, []);

  const impacto = useCallback(
    (estilo = 'Medium') => {
      const estilos = {
        Light: ImpactStyle.Light,
        Medium: ImpactStyle.Medium,
        Heavy: ImpactStyle.Heavy,
      };
      return ejecutar(`Impacto ${estilo}`, () => Haptics.impact({ style: estilos[estilo] }));
    },
    [ejecutar],
  );

  const notificacion = useCallback(
    (tipo = 'Success') => {
      const tipos = {
        Success: NotificationType.Success,
        Warning: NotificationType.Warning,
        Error: NotificationType.Error,
      };
      return ejecutar(`Notificación ${tipo}`, () => Haptics.notification({ type: tipos[tipo] }));
    },
    [ejecutar],
  );

  const vibrar = useCallback(
    (duracion = 300) => ejecutar(`Vibración ${duracion} ms`, () => Haptics.vibrate({ duration: duracion })),
    [ejecutar],
  );

  const abrirSeleccion = useCallback(async () => {
    await ejecutar('Selección iniciada', () => Haptics.selectionStart());
    setSeleccionAbierta(true);
  }, [ejecutar]);

  const cambiarSeleccion = useCallback(
    () => ejecutar('Selección cambiada', () => Haptics.selectionChanged()),
    [ejecutar],
  );

  const cerrarSeleccion = useCallback(async () => {
    await ejecutar('Selección terminada', () => Haptics.selectionEnd());
    setSeleccionAbierta(false);
  }, [ejecutar]);

  return {
    soporte,
    ultima,
    historial,
    error,
    seleccionAbierta,
    impacto,
    notificacion,
    vibrar,
    abrirSeleccion,
    cambiarSeleccion,
    cerrarSeleccion,
  };
}
