import {
  IonBadge, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonItem, IonLabel, IonList, IonNote,
} from '@ionic/react';
import { useRanking } from '../hooks/useRanking';
import type { Usuario } from '../lib/almacen';

type Props = { usuario: Usuario; puntos: number };

export default function Ranking({ usuario, puntos }: Props) {
  const { tabla, miPosicion, desdeNube } = useRanking(usuario, puntos);

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Top 5</IonCardTitle>
        <IonCardSubtitle>
          {desdeNube ? 'Puntajes traídos de Firebase' : 'Puntajes guardados en el dispositivo'}
          {miPosicion > 0 && ` · vas en el puesto ${miPosicion}`}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonList data-test="ranking">
          {tabla.map((f, i) => {
            const soyYo = f.uid === usuario.uid;
            return (
              <IonItem key={f.uid} color={soyYo ? 'light' : undefined}>
                <IonBadge slot="start" color={i === 0 ? 'warning' : 'medium'}>{i + 1}</IonBadge>
                <IonLabel>
                  <h3>{soyYo ? `${f.email} (tú)` : f.email}</h3>
                </IonLabel>
                <IonNote slot="end">{f.points} pts</IonNote>
              </IonItem>
            );
          })}
        </IonList>
      </IonCardContent>
    </IonCard>
  );
}
