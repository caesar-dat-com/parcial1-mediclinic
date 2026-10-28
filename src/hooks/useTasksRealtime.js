// Custom hook de Tasks sobre Firebase RealTime Database.
// Ojo: RealTime Database no es Firestore. Aquí se usan getDatabase, ref,
// onValue, push, set, update y remove, tal como en la clase 07.
import { useCallback, useEffect, useState } from 'react';
import { getDatabase, onValue, push, ref, remove, set, update } from 'firebase/database';
import { hayRealtime, obtenerApp } from '../services/firebase';
import * as respaldo from '../services/respaldoLocal';

const NODO = 'tasks';

function porFecha(a, b) {
  return Number(a.creado ?? 0) - Number(b.creado ?? 0);
}

export default function useTasksRealtime() {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hayRealtime) {
      return respaldo.suscribir(NODO, (filas) => {
        setTareas([...filas].sort(porFecha));
        setCargando(false);
      });
    }
    const base = getDatabase(obtenerApp());
    return onValue(
      ref(base, NODO),
      (captura) => {
        const valor = captura.val() ?? {};
        setTareas(
          Object.entries(valor)
            .map(([id, datos]) => ({ id, ...datos }))
            .sort(porFecha),
        );
        setCargando(false);
      },
      (fallo) => {
        setError(fallo.message);
        setCargando(false);
      },
    );
  }, []);

  const agregarTarea = useCallback(async (titulo) => {
    const datos = { titulo, completa: false, creado: Date.now() };
    if (!hayRealtime) return respaldo.agregar(NODO, datos);
    const nueva = push(ref(getDatabase(obtenerApp()), NODO));
    await set(nueva, datos);
    return nueva.key;
  }, []);

  const alternarTarea = useCallback(async (id, completa) => {
    if (!hayRealtime) return respaldo.actualizar(NODO, id, { completa });
    return update(ref(getDatabase(obtenerApp()), `${NODO}/${id}`), { completa });
  }, []);

  const eliminarTarea = useCallback(async (id) => {
    if (!hayRealtime) return respaldo.eliminar(NODO, id);
    return remove(ref(getDatabase(obtenerApp()), `${NODO}/${id}`));
  }, []);

  return {
    tareas,
    cargando,
    error,
    agregarTarea,
    alternarTarea,
    eliminarTarea,
    pendientes: tareas.filter((tarea) => !tarea.completa).length,
    origen: hayRealtime ? 'RealTime Database' : 'respaldo local (localStorage)',
  };
}
