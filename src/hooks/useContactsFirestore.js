// Custom hook de Contacts sobre Cloud Firestore.
// Patrón de la clase 07: todo el acceso a datos vive aquí, el componente solo
// consume lo que el hook devuelve.
import { useCallback, useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { hayFirebase, obtenerApp } from '../services/firebase';
import * as respaldo from '../services/respaldoLocal';

const COLECCION = 'contacts';

function porNombre(a, b) {
  return String(a.nombre ?? '').localeCompare(String(b.nombre ?? ''));
}

export default function useContactsFirestore() {
  const [contactos, setContactos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!hayFirebase) {
      return respaldo.suscribir(COLECCION, (filas) => {
        setContactos([...filas].sort(porNombre));
        setCargando(false);
      });
    }
    const base = getFirestore(obtenerApp());
    return onSnapshot(
      query(collection(base, COLECCION), orderBy('nombre')),
      (captura) => {
        setContactos(captura.docs.map((documento) => ({ id: documento.id, ...documento.data() })));
        setCargando(false);
      },
      (fallo) => {
        setError(fallo.message);
        setCargando(false);
      },
    );
  }, []);

  const agregarContacto = useCallback(async ({ nombre, telefono }) => {
    const datos = { nombre, telefono, creado: Date.now() };
    if (!hayFirebase) return respaldo.agregar(COLECCION, datos);
    const referencia = await addDoc(collection(getFirestore(obtenerApp()), COLECCION), datos);
    return referencia.id;
  }, []);

  const editarContacto = useCallback(async (id, cambios) => {
    if (!hayFirebase) return respaldo.actualizar(COLECCION, id, cambios);
    return updateDoc(doc(getFirestore(obtenerApp()), COLECCION, id), cambios);
  }, []);

  const eliminarContacto = useCallback(async (id) => {
    if (!hayFirebase) return respaldo.eliminar(COLECCION, id);
    return deleteDoc(doc(getFirestore(obtenerApp()), COLECCION, id));
  }, []);

  return {
    contactos,
    cargando,
    error,
    agregarContacto,
    editarContacto,
    eliminarContacto,
    origen: hayFirebase ? 'Cloud Firestore' : 'respaldo local (localStorage)',
  };
}
