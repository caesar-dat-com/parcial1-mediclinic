// Custom hook de Fruits sobre Dexie (IndexedDB).
// Incluye la `newFunction` que pide el enunciado: ver `newFunction` más abajo.
import { useCallback, useState } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../services/dexieDb';

export default function useFruitsDexie() {
  const [filtro, setFiltro] = useState('');

  const frutas = useLiveQuery(() => db.frutas.orderBy('nombre').toArray(), [], []);

  /**
   * newFunction — función extra del enunciado ("Fruits in Dexie - newFunction").
   *
   * Es una búsqueda viva sobre la tabla `frutas` de Dexie: filtra por nombre
   * (sin importar mayúsculas) y, de paso, devuelve el conteo de coincidencias y
   * la suma de unidades. Al ir dentro de un `useLiveQuery` se vuelve a calcular
   * sola cada vez que cambia la tabla o el texto buscado, sin recargar nada.
   */
  const resumen = useLiveQuery(
    async () => {
      const texto = filtro.trim().toLowerCase();
      const coincidencias = texto
        ? await db.frutas
            .orderBy('nombre')
            .filter((fruta) => String(fruta.nombre ?? '').toLowerCase().includes(texto))
            .toArray()
        : await db.frutas.orderBy('nombre').toArray();
      return {
        filas: coincidencias,
        total: coincidencias.length,
        unidades: coincidencias.reduce((suma, fruta) => suma + Number(fruta.cantidad ?? 0), 0),
      };
    },
    [filtro],
    { filas: [], total: 0, unidades: 0 },
  );

  /** Punto de entrada de la newFunction: cambia el texto buscado. */
  const newFunction = useCallback((texto) => setFiltro(texto ?? ''), []);

  const agregarFruta = useCallback(
    ({ nombre, cantidad }) => db.frutas.add({ nombre, cantidad: Number(cantidad) || 0 }),
    [],
  );

  const editarFruta = useCallback((id, cambios) => db.frutas.update(id, cambios), []);

  const eliminarFruta = useCallback((id) => db.frutas.delete(id), []);

  const vaciarFrutas = useCallback(() => db.frutas.clear(), []);

  return {
    // lista completa y lista ya filtrada por la newFunction
    frutas,
    frutasFiltradas: resumen.filas,
    filtro,
    total: resumen.total,
    unidades: resumen.unidades,
    // acciones
    newFunction,
    buscarFruta: newFunction,
    agregarFruta,
    editarFruta,
    eliminarFruta,
    vaciarFrutas,
    origen: 'Dexie / IndexedDB (local, funciona sin red)',
  };
}
