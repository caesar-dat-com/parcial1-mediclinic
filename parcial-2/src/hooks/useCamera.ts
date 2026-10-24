import { useCallback, useState } from 'react';
import { Camera, CameraResultType, CameraSource, type Photo } from '@capacitor/camera';

/** Tomar foto con la cámara o escogerla de la galería. */
export function useCamera() {
  const [foto, setFoto] = useState<Photo | null>(null);
  const [error, setError] = useState<string | null>(null);

  const capturar = useCallback(async (desdeGaleria = false) => {
    setError(null);
    try {
      const resultado = await Camera.getPhoto({
        quality: 80,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: desdeGaleria ? CameraSource.Photos : CameraSource.Camera,
      });
      setFoto(resultado);
      return resultado;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'No se tomó la foto');
      return null;
    }
  }, []);

  return { foto, imagen: foto?.dataUrl ?? null, error, capturar, limpiar: () => setFoto(null) };
}
