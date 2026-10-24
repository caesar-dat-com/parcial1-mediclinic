import { useLiveQuery } from 'dexie-react-hooks';
import { useCallback } from 'react';
import { db, type Registro } from '../lib/db';

/** CRUD sobre la base local (IndexedDB con Dexie), reactivo con useLiveQuery. */
export function useRegistrosLocales() {
  const registros = useLiveQuery(() => db.registros.orderBy('creado').reverse().toArray(), [], []);

  const agregar = useCallback(
    (datos: Omit<Registro, 'id' | 'creado' | 'sincronizado'>) =>
      db.registros.add({ ...datos, creado: new Date().toISOString(), sincronizado: 0 }),
    [],
  );

  const marcarSincronizado = useCallback(
    (id: number) => db.registros.update(id, { sincronizado: 1 }),
    [],
  );

  const borrar = useCallback((id: number) => db.registros.delete(id), []);
  const limpiar = useCallback(() => db.registros.clear(), []);

  const pendientes = (registros ?? []).filter((r) => r.sincronizado === 0).length;

  return { registros: registros ?? [], pendientes, agregar, borrar, limpiar, marcarSincronizado };
}
