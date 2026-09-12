import { IonBadge, IonItem, IonLabel, IonNote } from '@ionic/react';
import { COLOR, ETIQUETA } from '../context/Clinica';
import type { Visita } from '../types';

interface Props {
  visita: Visita;
}

function VisitaItem({ visita }: Props) {
  return (
    <IonItem button detail routerLink={`/visitas/${visita.id}`}>
      <IonLabel>
        <h2>{visita.paciente}</h2>
        <IonNote>
          {visita.hora} &middot; {visita.direccion}
        </IonNote>
      </IonLabel>
      <IonBadge slot="end" color={COLOR[visita.estado]}>
        {ETIQUETA[visita.estado]}
      </IonBadge>
    </IonItem>
  );
}

export default VisitaItem;
