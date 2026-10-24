import { useEffect, useState } from 'react';
import { Motion } from '@capacitor/motion';

type Aceleracion = { x: number; y: number; z: number };

/** Acelerómetro y orientación del equipo. */
export function useMotion(activo = true) {
  const [aceleracion, setAceleracion] = useState<Aceleracion>({ x: 0, y: 0, z: 0 });
  const [orientacion, setOrientacion] = useState({ alpha: 0, beta: 0, gamma: 0 });

  useEffect(() => {
    if (!activo) return;
    const accel = Motion.addListener('accel', (ev) => {
      const a = ev.accelerationIncludingGravity;
      setAceleracion({ x: a.x ?? 0, y: a.y ?? 0, z: a.z ?? 0 });
    });
    const orient = Motion.addListener('orientation', (ev) => {
      setOrientacion({ alpha: ev.alpha ?? 0, beta: ev.beta ?? 0, gamma: ev.gamma ?? 0 });
    });
    return () => {
      accel.then((h) => h.remove());
      orient.then((h) => h.remove());
    };
  }, [activo]);

  const magnitud = Math.sqrt(
    aceleracion.x ** 2 + aceleracion.y ** 2 + aceleracion.z ** 2,
  );

  return { aceleracion, orientacion, magnitud };
}
