import { IonButton, IonIcon, IonLabel } from '@ionic/react';
import {
  alarmOutline,
  cameraOutline,
  folderOpenOutline,
  hardwareChipOutline,
  locationOutline,
  notificationsOutline,
  pulseOutline,
  speedometerOutline,
} from 'ionicons/icons';

const ICONOS = {
  geolocation: locationOutline,
  camera: cameraOutline,
  motion: speedometerOutline,
  device: hardwareChipOutline,
  haptics: pulseOutline,
  filesystem: folderOpenOutline,
  'local-notifications': alarmOutline,
  'push-notifications': notificationsOutline,
};

// Botón de la Home: uno por cada sensor, tal como pide el enunciado.
export default function BotonSensor({ sensor, onAbrir }) {
  return (
    <IonButton
      expand="block"
      className="boton-sensor"
      data-testid={`boton-${sensor.slug}`}
      onClick={() => onAbrir(sensor)}
    >
      <IonIcon slot="start" icon={ICONOS[sensor.slug]} aria-hidden="true" />
      <IonLabel>{sensor.titulo}</IonLabel>
    </IonButton>
  );
}
