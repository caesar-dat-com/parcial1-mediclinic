// Custom hook con TODA la logica de Cloud Firestore para la coleccion `tareas`.
// Recibe el uid del usuario autenticado y expone el CRUD + la suscripcion en vivo.
// Igual que con el auth, ningun componente importa 'firebase/firestore'.
import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db, hayFirebase } from '../firebase/config';
import { tareasLocal } from '../firebase/local';

const COLECCION = 'tareas';

function mensajeDe(error) {
  if (error?.code === 'permission-denied') return 'Firestore rechazo la operacion (reglas).';
  if (error?.code === 'unavailable') return 'Sin conexion con Firestore. Intenta de nuevo.';
  return error?.message ?? 'No se pudo completar la operacion.';
}

export default function useTasksFirebase(uid) {
  const [tareas, setTareas] = useState([]);
  const [cargando, setCargando] = useState(Boolean(uid));
  const [error, setError] = useState('');

  useEffect(() => {
    if (!uid) {
      setTareas([]);
      setCargando(false);
      return undefined;
    }
    setCargando(true);
    if (hayFirebase) {
      const consulta = query(
        collection(db, COLECCION),
        where('uid', '==', uid),
        orderBy('creada', 'desc'),
      );
      return onSnapshot(
        consulta,
        (resultado) => {
          setTareas(resultado.docs.map((documento) => ({ id: documento.id, ...documento.data() })));
          setCargando(false);
        },
        (fallo) => {
          setError(mensajeDe(fallo));
          setCargando(false);
        },
      );
    }
    return tareasLocal.subscribe(uid, (lista) => {
      setTareas(lista);
      setCargando(false);
    });
  }, [uid]);

  const crearTarea = useCallback(
    async ({ titulo, detalle = '' }) => {
      if (!uid) return null;
      setError('');
      try {
        if (hayFirebase) {
          const creada = await addDoc(collection(db, COLECCION), {
            uid,
            titulo,
            detalle,
            completa: false,
            creada: Date.now(),
            actualizada: serverTimestamp(),
          });
          return creada.id;
        }
        return await tareasLocal.add(uid, { titulo, detalle });
      } catch (fallo) {
        setError(mensajeDe(fallo));
        return null;
      }
    },
    [uid],
  );

  const actualizarTarea = useCallback(
    async (id, cambios) => {
      if (!uid) return false;
      setError('');
      try {
        if (hayFirebase) {
          await updateDoc(doc(db, COLECCION, id), { ...cambios, actualizada: serverTimestamp() });
        } else {
          await tareasLocal.update(uid, id, cambios);
        }
        return true;
      } catch (fallo) {
        setError(mensajeDe(fallo));
        return false;
      }
    },
    [uid],
  );

  const eliminarTarea = useCallback(
    async (id) => {
      if (!uid) return false;
      setError('');
      try {
        if (hayFirebase) await deleteDoc(doc(db, COLECCION, id));
        else await tareasLocal.remove(uid, id);
        return true;
      } catch (fallo) {
        setError(mensajeDe(fallo));
        return false;
      }
    },
    [uid],
  );

  // Lectura sincrona desde la suscripcion: es lo que usan la pagina de detalle y la de editar.
  const obtenerTarea = useCallback((id) => tareas.find((tarea) => tarea.id === id) ?? null, [tareas]);

  // Lectura puntual por si se entra directo a /tasks/:id antes de que llegue el snapshot.
  const cargarTarea = useCallback(
    async (id) => {
      if (!uid) return null;
      try {
        if (hayFirebase) {
          const documento = await getDoc(doc(db, COLECCION, id));
          return documento.exists() ? { id: documento.id, ...documento.data() } : null;
        }
        return await tareasLocal.get(uid, id);
      } catch (fallo) {
        setError(mensajeDe(fallo));
        return null;
      }
    },
    [uid],
  );

  const pendientes = tareas.filter((tarea) => !tarea.completa).length;

  return {
    tareas,
    pendientes,
    cargando,
    error,
    crearTarea,
    actualizarTarea,
    eliminarTarea,
    obtenerTarea,
    cargarTarea,
    usandoFirebase: hayFirebase,
  };
}
