import { useCallback, useEffect, useState } from 'react';
import { supabase, haySupabase } from '../lib/supabase';

/** Lectura, escritura y tiempo real sobre una tabla de Supabase. */
export function useSupabaseTabla<T extends Record<string, unknown>>(tabla: string) {
  const [filas, setFilas] = useState<T[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargar = useCallback(async () => {
    if (!supabase) return;
    setCargando(true);
    const { data, error } = await supabase.from(tabla).select('*').order('id', { ascending: false });
    if (error) setError(error.message);
    else setFilas((data ?? []) as T[]);
    setCargando(false);
  }, [tabla]);

  const insertar = useCallback(
    async (fila: Partial<T>) => {
      if (!supabase) return null;
      // el tipado genérico de supabase-js no acepta Partial<T> directo
      const { data, error } = await supabase
        .from(tabla)
        .insert(fila as never)
        .select()
        .single();
      if (error) {
        setError(error.message);
        return null;
      }
      return data as T;
    },
    [tabla],
  );

  const eliminar = useCallback(
    async (id: number | string) => {
      if (!supabase) return;
      const { error } = await supabase.from(tabla).delete().eq('id', id);
      if (error) setError(error.message);
    },
    [tabla],
  );

  useEffect(() => {
    if (!haySupabase) return;
    cargar();
    const canal = supabase!
      .channel(`realtime-${tabla}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tabla }, cargar)
      .subscribe();
    return () => {
      supabase!.removeChannel(canal);
    };
  }, [tabla, cargar]);

  return { filas, error, cargando, cargar, insertar, eliminar, disponible: haySupabase };
}
