import { createClient } from '@supabase/supabase-js';

// Las llaves van en .env (VITE_SUPABASE_URL y VITE_SUPABASE_KEY), nunca en el código.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const key = import.meta.env.VITE_SUPABASE_KEY as string | undefined;

export const haySupabase = Boolean(url && key);

/** Cliente único para toda la app. Si no hay llaves, queda nulo y la app sigue funcionando local. */
export const supabase = haySupabase ? createClient(url as string, key as string) : null;
