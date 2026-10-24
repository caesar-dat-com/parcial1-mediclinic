import { useEffect, useState } from 'react';
import { Device, type DeviceInfo, type BatteryInfo } from '@capacitor/device';

/** Datos del equipo y su batería. */
export function useDevice() {
  const [info, setInfo] = useState<DeviceInfo | null>(null);
  const [bateria, setBateria] = useState<BatteryInfo | null>(null);

  useEffect(() => {
    Device.getInfo().then(setInfo);
    Device.getBatteryInfo().then(setBateria).catch(() => undefined);
  }, []);

  return { info, bateria };
}
