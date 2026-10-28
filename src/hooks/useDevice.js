import { useCallback, useEffect, useState } from 'react';
import { Device } from '@capacitor/device';
import { mensajeError, revisarSoporte } from './soporte';

export default function useDevice() {
  const [soporte] = useState(() =>
    revisarSoporte('Device', {
      soportaWeb: true,
      nota: 'La implementación web deduce los datos del user agent. El modelo real, el fabricante y el identificador solo son fiables en Android o iOS, y la batería depende de navigator.getBattery.',
    }),
  );
  const [info, setInfo] = useState(null);
  const [identificador, setIdentificador] = useState(null);
  const [idioma, setIdioma] = useState(null);
  const [bateria, setBateria] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [avisoBateria, setAvisoBateria] = useState('');

  const leerBateria = useCallback(async () => {
    setAvisoBateria('');
    try {
      const datos = await Device.getBatteryInfo();
      if (datos == null || (datos.batteryLevel == null && datos.isCharging == null)) {
        setBateria(null);
        setAvisoBateria('Este navegador no entrega el estado de la batería.');
        return;
      }
      setBateria({
        nivel: datos.batteryLevel == null ? '—' : `${Math.round(datos.batteryLevel * 100)} %`,
        cargando: datos.isCharging == null ? '—' : datos.isCharging ? 'sí' : 'no',
      });
    } catch (fallo) {
      setBateria(null);
      setAvisoBateria(mensajeError(fallo, 'No se pudo leer la batería en esta plataforma.'));
    }
  }, []);

  const consultar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const [datos, id, lengua] = await Promise.all([
        Device.getInfo(),
        Device.getId(),
        Device.getLanguageTag ? Device.getLanguageTag() : Promise.resolve(null),
      ]);
      setInfo({
        plataforma: datos.platform,
        sistema: `${datos.operatingSystem ?? '—'} ${datos.osVersion ?? ''}`.trim(),
        modelo: datos.model ?? '—',
        fabricante: datos.manufacturer ?? '—',
        navegadorWeb: datos.webViewVersion ?? '—',
        esVirtual: datos.isVirtual ? 'sí' : 'no',
        memoria:
          typeof datos.memUsed === 'number'
            ? `${Math.round(datos.memUsed / 1024 / 1024)} MB en uso`
            : '—',
      });
      setIdentificador(id?.identifier ?? '—');
      const codigo = await Device.getLanguageCode();
      setIdioma({
        codigo: codigo?.value ?? '—',
        etiqueta: lengua?.value ?? '—',
      });
      await leerBateria();
    } catch (fallo) {
      setError(mensajeError(fallo, 'No se pudo leer la información del dispositivo.'));
    } finally {
      setCargando(false);
    }
  }, [leerBateria]);

  useEffect(() => {
    consultar();
  }, [consultar]);

  return {
    soporte,
    info,
    identificador,
    idioma,
    bateria,
    avisoBateria,
    cargando,
    error,
    consultar,
    leerBateria,
  };
}
