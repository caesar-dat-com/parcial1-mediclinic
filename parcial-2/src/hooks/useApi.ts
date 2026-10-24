import axios, { type AxiosRequestConfig } from 'axios';
import { useCallback, useState } from 'react';

/** Llamadas HTTP con axios: GET, POST, PUT y DELETE con estado de carga y error. */
export function useApi<T = unknown>(baseURL?: string) {
  const [datos, setDatos] = useState<T | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cliente = axios.create({ baseURL, timeout: 15000 });

  const pedir = useCallback(
    async (metodo: 'get' | 'post' | 'put' | 'delete', url: string, cuerpo?: unknown,
           config?: AxiosRequestConfig) => {
      setCargando(true);
      setError(null);
      try {
        const r = metodo === 'get' || metodo === 'delete'
          ? await cliente[metodo]<T>(url, config)
          : await cliente[metodo]<T>(url, cuerpo, config);
        setDatos(r.data);
        return r.data;
      } catch (e) {
        const msg = axios.isAxiosError(e)
          ? `${e.response?.status ?? ''} ${e.message}`.trim()
          : 'Falló la petición';
        setError(msg);
        return null;
      } finally {
        setCargando(false);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseURL],
  );

  return {
    datos, cargando, error,
    get: (url: string, c?: AxiosRequestConfig) => pedir('get', url, undefined, c),
    post: (url: string, cuerpo: unknown) => pedir('post', url, cuerpo),
    put: (url: string, cuerpo: unknown) => pedir('put', url, cuerpo),
    del: (url: string) => pedir('delete', url),
  };
}
