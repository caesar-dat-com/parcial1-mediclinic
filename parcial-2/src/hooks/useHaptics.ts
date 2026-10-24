import { useCallback } from 'react';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';

/** Vibraciones de respuesta táctil. */
export function useHaptics() {
  const golpe = useCallback(
    (estilo: ImpactStyle = ImpactStyle.Medium) => Haptics.impact({ style: estilo }),
    [],
  );
  const aviso = useCallback(
    (tipo: NotificationType = NotificationType.Success) => Haptics.notification({ type: tipo }),
    [],
  );
  const vibrar = useCallback((ms = 300) => Haptics.vibrate({ duration: ms }), []);

  return { golpe, aviso, vibrar, ImpactStyle, NotificationType };
}
