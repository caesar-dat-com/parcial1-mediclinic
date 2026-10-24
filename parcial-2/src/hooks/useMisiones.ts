import { useCallback, useEffect, useMemo, useState } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, hayFirebase } from '../lib/firebase';
import {
  guardarProgreso, leerProgreso, PROGRESO_VACIO, type Progreso, type Usuario,
} from '../lib/almacen';
import { useLocalNotifications } from './useLocalNotifications';

export type Mision = {
  id: number;
  nombre: string;
  descripcion: string;
  puntos: number;
  completada: boolean;
};

export const CATALOGO = [
  { id: 1, nombre: 'Evidencia', descripcion: 'Toma una foto con la cámara', puntos: 40 },
  { id: 2, nombre: 'Movimiento real', descripcion: 'Aléjate más de 30 metros de donde empezaste', puntos: 40 },
  { id: 3, nombre: 'Permanencia activa', descripcion: 'Quédate quieto 10 segundos y el celular vibra', puntos: 40 },
];

/**
 * Estado de las misiones, los puntos y el progreso.
 * Guarda en Firestore y en el almacenamiento local al mismo tiempo, con el
 * formato { points, missions } que pide el enunciado.
 */
export function useMisiones(usuario: Usuario | null) {
  const [progreso, setProgreso] = useState<Progreso>(PROGRESO_VACIO);
  const [sincronizado, setSincronizado] = useState(false);
  const { notificar } = useLocalNotifications();

  // al entrar: primero lo local (instantáneo), luego lo de la nube si existe
  useEffect(() => {
    if (!usuario) return;
    setProgreso(leerProgreso(usuario.uid));
    if (!hayFirebase || !db) return;
    getDoc(doc(db, 'progresos', usuario.uid))
      .then((snap) => {
        if (snap.exists()) {
          const remoto = snap.data() as Progreso;
          setProgreso(remoto);
          guardarProgreso(usuario.uid, remoto);
        }
        setSincronizado(true);
      })
      .catch(() => setSincronizado(false));
  }, [usuario]);

  const persistir = useCallback(
    async (nuevo: Progreso) => {
      if (!usuario) return;
      setProgreso(nuevo);
      guardarProgreso(usuario.uid, nuevo);
      if (hayFirebase && db) {
        try {
          await setDoc(doc(db, 'progresos', usuario.uid), {
            ...nuevo, email: usuario.email, actualizado: new Date().toISOString(),
          });
          setSincronizado(true);
        } catch {
          setSincronizado(false);
        }
      }
    },
    [usuario],
  );

  const misiones: Mision[] = useMemo(
    () =>
      CATALOGO.map((m) => ({
        ...m,
        completada: progreso.missions.find((x) => x.id === m.id)?.completed ?? false,
      })),
    [progreso],
  );

  const completadas = misiones.filter((m) => m.completada).length;
  const porcentaje = Math.round((completadas / CATALOGO.length) * 100);

  /** Marca una misión como cumplida, suma sus puntos y avisa por notificación. */
  const completar = useCallback(
    async (id: number) => {
      const mision = CATALOGO.find((m) => m.id === id);
      if (!mision) return;
      if (progreso.missions.find((x) => x.id === id)?.completed) return;

      const missions = progreso.missions.map((x) =>
        x.id === id ? { ...x, completed: true } : x,
      );
      const nuevo: Progreso = { points: progreso.points + mision.puntos, missions };
      await persistir(nuevo);

      const hechas = missions.filter((x) => x.completed).length;
      const faltan = CATALOGO.length - hechas;
      await notificar('Has completado una misión', `${mision.nombre} · +${mision.puntos} puntos`);
      if (faltan === 1) {
        await notificar('Te falta 1 misión para completar', 'Ya casi terminas el recorrido');
      }
    },
    [progreso, persistir, notificar],
  );

  const reiniciar = useCallback(() => persistir(PROGRESO_VACIO), [persistir]);

  return {
    misiones, puntos: progreso.points, progreso, completadas,
    total: CATALOGO.length, porcentaje, completar, reiniciar,
    sincronizado, enNube: hayFirebase,
    habilitada: (id: number) => (id === 3 ? misiones[1].completada : true),
  };
}
