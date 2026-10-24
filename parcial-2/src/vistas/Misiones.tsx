import { useEffect, useState } from 'react';
import {
  IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonChip, IonItem, IonLabel, IonList, IonNote, IonProgressBar, IonText,
} from '@ionic/react';
import { useCamera } from '../hooks/useCamera';
import { useDistancia } from '../hooks/useDistancia';
import { useQuieto } from '../hooks/useQuieto';
import { useHaptics } from '../hooks/useHaptics';
import type { useMisiones } from '../hooks/useMisiones';

type Props = { control: ReturnType<typeof useMisiones> };

export default function Misiones({ control }: Props) {
  const { misiones, puntos, completadas, total, porcentaje, completar } = control;
  const { imagen, capturar } = useCamera();
  const { recorrido, coords, ubicar, error: errorGps } = useDistancia();
  const { golpe, vibrar } = useHaptics();

  const mision2Lista = misiones[1]?.completada ?? false;
  const [esperando, setEsperando] = useState(false);
  const { segundos, logrado, meta } = useQuieto(esperando && mision2Lista, 10);

  // Misión 1: se completa al guardar la imagen
  useEffect(() => {
    if (imagen && !misiones[0].completada) {
      golpe();
      completar(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imagen]);

  // Misión 2: alejarse más de 30 metros del punto de partida
  useEffect(() => {
    if (recorrido > 30 && !misiones[1].completada) completar(2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recorrido]);

  // Misión 3: diez segundos quieto y el equipo vibra
  useEffect(() => {
    if (logrado && !misiones[2].completada) {
      vibrar(800);
      completar(3);
      setEsperando(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logrado]);

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            {puntos} puntos <IonBadge color="primary">{completadas}/{total}</IonBadge>
          </IonCardTitle>
          <IonCardSubtitle>{porcentaje}% completado</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonProgressBar value={porcentaje / 100} data-test="progreso" />
        </IonCardContent>
      </IonCard>

      <IonList data-test="misiones">
        {misiones.map((m) => (
          <IonItem key={m.id}>
            <IonLabel>
              <h2>{m.id}. {m.nombre}</h2>
              <p>{m.descripcion}</p>
              <IonNote>{m.puntos} puntos</IonNote>
            </IonLabel>
            <IonBadge slot="end" color={m.completada ? 'success' : 'medium'}>
              {m.completada ? 'completada' : 'pendiente'}
            </IonBadge>
          </IonItem>
        ))}
      </IonList>

      <IonCard>
        <IonCardHeader><IonCardTitle>1. Evidencia</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton onClick={() => capturar()} disabled={misiones[0].completada} data-test="foto">
            {misiones[0].completada ? 'Foto guardada' : 'Tomar foto'}
          </IonButton>
          {imagen && (
            <img src={imagen} alt="evidencia" style={{ marginTop: 12, borderRadius: 8, maxHeight: 220 }} />
          )}
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>2. Movimiento real</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton onClick={() => ubicar()} size="small" data-test="gps">Activar GPS</IonButton>
          <p>
            Te has alejado <strong data-test="recorrido">{recorrido.toFixed(1)} m</strong> del punto
            de partida. La misión se cumple pasando los 30 m.
          </p>
          {coords && (
            <IonChip>{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</IonChip>
          )}
          {errorGps && <IonText color="danger"><p>{errorGps}</p></IonText>}
          <IonProgressBar value={Math.min(recorrido / 30, 1)} color="secondary" />
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>3. Permanencia activa</IonCardTitle>
          <IonCardSubtitle>
            {mision2Lista ? 'Disponible' : 'Se habilita al completar la misión 2'}
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton
            disabled={!mision2Lista || misiones[2].completada}
            onClick={() => setEsperando(true)}
            data-test="quieto"
          >
            {esperando ? `Quieto… ${segundos}s` : 'Empezar los 10 segundos'}
          </IonButton>
          {esperando && <IonProgressBar value={segundos / meta} color="tertiary" />}
          <IonNote>
            <p>Se mide con el acelerómetro: si te mueves, el conteo vuelve a cero.</p>
          </IonNote>
        </IonCardContent>
      </IonCard>
    </>
  );
}
