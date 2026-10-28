// Base de datos local con Dexie (IndexedDB). Esta sí es real siempre: no
// necesita red ni credenciales, que es justo lo que pide el enunciado para que
// Fruits siga funcionando cuando no hay conexión.
import Dexie from 'dexie';

export const db = new Dexie('challenge06');

db.version(1).stores({
  // ++id autoincremental; indexamos nombre para poder ordenar y buscar.
  frutas: '++id, nombre, cantidad',
});
