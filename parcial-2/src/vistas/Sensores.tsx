import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonList, IonNote } from '@ionic/react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useCamera } from '../hooks/useCamera';
import { useMotion } from '../hooks/useMotion';
import { useDevice } from '../hooks/useDevice';
import { useHaptics } from '../hooks/useHaptics';
import { useLocalNotifications } from '../hooks/useLocalNotifications';

export default function Sensores() {
  const { coords, cargando, error, ubicar } = useGeolocation();
  const { imagen, capturar } = useCamera();
  const { aceleracion, magnitud } = useMotion();
  const { info, bateria } = useDevice();
  const { golpe, vibrar } = useHaptics();
  const { notificar, permitido } = useLocalNotifications();

  return (
    <>
      <IonCard>
        <IonCardHeader><IonCardTitle>Ubicación</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton onClick={() => ubicar()} disabled={cargando} data-test="btn-ubicar">
            {cargando ? 'Buscando…' : 'Obtener ubicación'}
          </IonButton>
          {coords && (
            <IonNote>
              <p data-test="coords">
                Lat {coords.lat.toFixed(5)} · Lng {coords.lng.toFixed(5)} · ±{Math.round(coords.precision)} m
              </p>
            </IonNote>
          )}
          {error && <p style={{ color: 'var(--ion-color-danger)' }}>{error}</p>}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Cámara</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton onClick={() => capturar()}>Tomar foto</IonButton>
          <IonButton fill="outline" onClick={() => capturar(true)}>Galería</IonButton>
          {imagen && <img src={imagen} alt="captura" style={{ marginTop: 12, borderRadius: 8 }} />}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Acelerómetro</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem><IonLabel>X</IonLabel><IonNote slot="end">{aceleracion.x.toFixed(2)}</IonNote></IonItem>
            <IonItem><IonLabel>Y</IonLabel><IonNote slot="end">{aceleracion.y.toFixed(2)}</IonNote></IonItem>
            <IonItem><IonLabel>Z</IonLabel><IonNote slot="end">{aceleracion.z.toFixed(2)}</IonNote></IonItem>
            <IonItem><IonLabel>Magnitud</IonLabel><IonNote slot="end">{magnitud.toFixed(2)}</IonNote></IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Equipo</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonList>
            <IonItem><IonLabel>Plataforma</IonLabel><IonNote slot="end">{info?.platform ?? '—'}</IonNote></IonItem>
            <IonItem><IonLabel>Sistema</IonLabel><IonNote slot="end">{info?.operatingSystem ?? '—'}</IonNote></IonItem>
            <IonItem>
              <IonLabel>Batería</IonLabel>
              <IonNote slot="end">
                {bateria?.batteryLevel != null ? `${Math.round(bateria.batteryLevel * 100)}%` : '—'}
              </IonNote>
            </IonItem>
          </IonList>
          <IonButton size="small" onClick={() => golpe()}>Vibración corta</IonButton>
          <IonButton size="small" fill="outline" onClick={() => vibrar(600)}>Vibrar 600 ms</IonButton>
          <IonButton
            size="small"
            color="secondary"
            onClick={() => notificar('Parcial 2', 'Notificación local de prueba', 3)}
          >
            Notificar {permitido ? '' : '(pide permiso)'}
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
}
