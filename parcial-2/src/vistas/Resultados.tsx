import {
  IonBadge, IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle,
  IonCardTitle, IonItem, IonLabel, IonList, IonNote, IonProgressBar, IonText,
} from '@ionic/react';
import type { useMisiones } from '../hooks/useMisiones';

type Props = { control: ReturnType<typeof useMisiones>; correo: string };

export default function Resultados({ control, correo }: Props) {
  const { puntos, completadas, total, porcentaje, misiones, progreso, reiniciar,
          enNube, sincronizado } = control;

  const estado = completadas === total
    ? 'Recorrido terminado'
    : completadas === 0 ? 'Sin empezar' : 'En progreso';

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle data-test="puntos-totales">{puntos} puntos</IonCardTitle>
          <IonCardSubtitle>{correo}</IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonProgressBar value={porcentaje / 100} />
          <IonList>
            <IonItem>
              <IonLabel>Misiones completadas</IonLabel>
              <IonNote slot="end">{completadas} de {total}</IonNote>
            </IonItem>
            <IonItem>
              <IonLabel>Estado general</IonLabel>
              <IonBadge slot="end" color={completadas === total ? 'success' : 'warning'}>
                {estado}
              </IonBadge>
            </IonItem>
            <IonItem>
              <IonLabel>Guardado</IonLabel>
              <IonNote slot="end">
                {enNube ? (sincronizado ? 'Firebase y local' : 'local (nube sin responder)') : 'local'}
              </IonNote>
            </IonItem>
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Detalle por misión</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonList>
            {misiones.map((m) => (
              <IonItem key={m.id}>
                <IonLabel>{m.nombre}</IonLabel>
                <IonNote slot="end">
                  {m.completada ? `+${m.puntos}` : '—'}
                </IonNote>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Lo que se guarda</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonText color="medium">
            <pre data-test="json" style={{ fontSize: 12, whiteSpace: 'pre-wrap' }}>
              {JSON.stringify(progreso, null, 2)}
            </pre>
          </IonText>
          <IonButton fill="outline" color="medium" size="small" onClick={reiniciar}>
            Reiniciar progreso
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
}
