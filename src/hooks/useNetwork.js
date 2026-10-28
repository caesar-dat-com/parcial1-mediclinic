// Custom hook del estado de red.
//
// Fuente principal: @capacitor/network (lo que vimos en la clase 07).
// Respaldo web: los eventos `online` / `offline` del navegador, que son los que
// podemos forzar desde Playwright con `context.setOffline(true)`.
import { useEffect, useState } from 'react';
import { Network } from '@capacitor/network';

function estadoInicial() {
  if (typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
}

export default function useNetwork() {
  const [conectado, setConectado] = useState(estadoInicial);
  const [tipo, setTipo] = useState('unknown');

  useEffect(() => {
    let vivo = true;
    let suscripcion;

    async function arrancar() {
      try {
        const estado = await Network.getStatus();
        if (!vivo) return;
        setConectado(estado.connected);
        setTipo(estado.connectionType ?? 'unknown');
      } catch {
        // Sin plugin disponible nos quedamos con navigator.onLine.
      }
      try {
        suscripcion = await Network.addListener('networkStatusChange', (estado) => {
          if (!vivo) return;
          setConectado(estado.connected);
          setTipo(estado.connectionType ?? 'unknown');
        });
      } catch {
        // Idem.
      }
    }

    arrancar();

    const alConectar = () => setConectado(true);
    const alDesconectar = () => setConectado(false);
    window.addEventListener('online', alConectar);
    window.addEventListener('offline', alDesconectar);

    return () => {
      vivo = false;
      suscripcion?.remove?.();
      window.removeEventListener('online', alConectar);
      window.removeEventListener('offline', alDesconectar);
    };
  }, []);

  return { conectado, sinRed: !conectado, tipo };
}
