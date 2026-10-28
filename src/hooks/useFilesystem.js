import { useCallback, useEffect, useState } from 'react';
import { Directory, Encoding, Filesystem } from '@capacitor/filesystem';
import { mensajeError, revisarSoporte } from './soporte';

const CARPETA = 'challenge07';
const DIRECTORIO = Directory.Data;

export default function useFilesystem() {
  const [soporte] = useState(() =>
    revisarSoporte('Filesystem', {
      soportaWeb: true,
      nota: 'En navegador el plugin guarda todo en IndexedDB, así que escribir, leer, listar y borrar funcionan de verdad, pero los archivos no salen del origen ni se ven desde otra app. Directory.Documents y los permisos de almacenamiento solo aplican en el dispositivo.',
    }),
  );
  const [archivos, setArchivos] = useState([]);
  const [contenido, setContenido] = useState(null);
  const [aviso, setAviso] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const asegurarCarpeta = useCallback(async () => {
    try {
      await Filesystem.mkdir({ path: CARPETA, directory: DIRECTORIO, recursive: true });
    } catch (fallo) {
      // Si ya existe, Capacitor lanza "Directory exists": no es un problema.
      if (!/exist/i.test(mensajeError(fallo, ''))) throw fallo;
    }
  }, []);

  const listar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      await asegurarCarpeta();
      const resultado = await Filesystem.readdir({ path: CARPETA, directory: DIRECTORIO });
      setArchivos(
        (resultado.files || []).map((archivo) =>
          typeof archivo === 'string'
            ? { nombre: archivo, peso: '—' }
            : {
                nombre: archivo.name,
                peso: archivo.size == null ? '—' : `${archivo.size} B`,
                tipo: archivo.type ?? 'file',
              },
        ),
      );
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo listar la carpeta.'));
    } finally {
      setCargando(false);
    }
  }, [asegurarCarpeta]);

  const escribir = useCallback(
    async (nombre, texto) => {
      setError('');
      setAviso('');
      const limpio = (nombre || '').trim();
      if (!limpio) {
        setError('Escribe el nombre del archivo.');
        return;
      }
      try {
        await asegurarCarpeta();
        await Filesystem.writeFile({
          path: `${CARPETA}/${limpio}`,
          data: texto ?? '',
          directory: DIRECTORIO,
          encoding: Encoding.UTF8,
          recursive: true,
        });
        setAviso(`Guardado ${limpio}`);
        await listar();
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudo escribir el archivo.'));
      }
    },
    [asegurarCarpeta, listar],
  );

  const leer = useCallback(async (nombre) => {
    setError('');
    setAviso('');
    try {
      const resultado = await Filesystem.readFile({
        path: `${CARPETA}/${nombre}`,
        directory: DIRECTORIO,
        encoding: Encoding.UTF8,
      });
      setContenido({ nombre, texto: String(resultado.data ?? '') });
      setAviso(`Leído ${nombre}`);
    } catch (fallo) {
      setContenido(null);
      setError(mensajeError(fallo, 'No se pudo leer el archivo.'));
    }
  }, []);

  const borrar = useCallback(
    async (nombre) => {
      setError('');
      setAviso('');
      try {
        await Filesystem.deleteFile({ path: `${CARPETA}/${nombre}`, directory: DIRECTORIO });
        setContenido((previo) => (previo?.nombre === nombre ? null : previo));
        setAviso(`Borrado ${nombre}`);
        await listar();
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudo borrar el archivo.'));
      }
    },
    [listar],
  );

  const estadisticas = useCallback(async (nombre) => {
    setError('');
    try {
      const datos = await Filesystem.stat({ path: `${CARPETA}/${nombre}`, directory: DIRECTORIO });
      setAviso(`${nombre}: ${datos.size} B · ${new Date(datos.mtime).toLocaleString()}`);
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo consultar el archivo.'));
    }
  }, []);

  useEffect(() => {
    listar();
  }, [listar]);

  return {
    soporte,
    carpeta: CARPETA,
    archivos,
    contenido,
    aviso,
    error,
    cargando,
    escribir,
    leer,
    borrar,
    listar,
    estadisticas,
  };
}
