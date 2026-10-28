import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { mensajeError, revisarSoporte } from './soporte';

// En web el plugin abre un selector de archivos (y necesita los pwa-elements
// para la cámara en vivo), así que el hook expone además un respaldo con
// <input type="file"> que es lo que de verdad funciona en un escritorio.
export default function useCamera() {
  const [soporte] = useState(() =>
    revisarSoporte('Camera', {
      soportaWeb: true,
      nota: 'En navegador el plugin abre un selector de archivos; la cámara en vivo necesita @ionic/pwa-elements y permisos, por eso se incluye el respaldo con <input type="file">.',
    }),
  );
  const [foto, setFoto] = useState(null);
  const [origen, setOrigen] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const urlTemporal = useRef(null);

  const limpiarUrl = useCallback(() => {
    if (urlTemporal.current) {
      URL.revokeObjectURL(urlTemporal.current);
      urlTemporal.current = null;
    }
  }, []);

  const pedirPermisos = useCallback(async () => {
    setError('');
    try {
      const estado = await Camera.requestPermissions({ permissions: ['camera', 'photos'] });
      return estado;
    } catch (fallo) {
      setError(mensajeError(fallo, 'Este navegador no expone los permisos de cámara de Capacitor.'));
      return null;
    }
  }, []);

  const capturar = useCallback(
    async (fuente, etiqueta) => {
      setCargando(true);
      setError('');
      try {
        const resultado = await Camera.getPhoto({
          quality: 70,
          allowEditing: false,
          resultType: CameraResultType.DataUrl,
          source: fuente,
        });
        limpiarUrl();
        setFoto({
          src: resultado.dataUrl,
          formato: resultado.format || 'desconocido',
          guardada: Boolean(resultado.saved),
        });
        setOrigen(etiqueta);
      } catch (fallo) {
        setError(mensajeError(fallo, 'No se pudo obtener la imagen.'));
      } finally {
        setCargando(false);
      }
    },
    [limpiarUrl],
  );

  const tomarFoto = useCallback(() => capturar(CameraSource.Camera, 'Cámara'), [capturar]);
  const elegirDeGaleria = useCallback(() => capturar(CameraSource.Photos, 'Galería'), [capturar]);

  // Respaldo web: el componente solo entrega el File, la lógica vive aquí.
  const usarArchivo = useCallback(
    (archivo) => {
      setError('');
      if (!archivo) {
        setError('No se seleccionó ningún archivo.');
        return;
      }
      if (!archivo.type.startsWith('image/')) {
        setError('El archivo elegido no es una imagen.');
        return;
      }
      limpiarUrl();
      const url = URL.createObjectURL(archivo);
      urlTemporal.current = url;
      setFoto({
        src: url,
        formato: archivo.type.replace('image/', ''),
        guardada: false,
        nombre: archivo.name,
        peso: `${Math.max(1, Math.round(archivo.size / 1024))} KB`,
      });
      setOrigen('Respaldo web (input type=file)');
    },
    [limpiarUrl],
  );

  const borrarFoto = useCallback(() => {
    limpiarUrl();
    setFoto(null);
    setOrigen('');
    setError('');
  }, [limpiarUrl]);

  useEffect(() => limpiarUrl, [limpiarUrl]);

  return {
    soporte,
    foto,
    origen,
    cargando,
    error,
    tomarFoto,
    elegirDeGaleria,
    usarArchivo,
    borrarFoto,
    pedirPermisos,
  };
}
