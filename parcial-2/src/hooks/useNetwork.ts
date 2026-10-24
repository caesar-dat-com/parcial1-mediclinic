import { useEffect, useState } from 'react';
import { Network, type ConnectionStatus } from '@capacitor/network';

/** Estado de conexión del dispositivo. Sirve para decidir si guardo local o remoto. */
export function useNetwork() {
  const [estado, setEstado] = useState<ConnectionStatus>({
    connected: true,
    connectionType: 'unknown',
  });

  useEffect(() => {
    Network.getStatus().then(setEstado);
    const sub = Network.addListener('networkStatusChange', setEstado);
    return () => {
      sub.then((s) => s.remove());
    };
  }, []);

  return { conectado: estado.connected, tipo: estado.connectionType };
}
