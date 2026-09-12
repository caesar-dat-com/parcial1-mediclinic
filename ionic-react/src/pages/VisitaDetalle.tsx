import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { COLOR, ETIQUETA, SIGUIENTE, useClinica } from '../context/Clinica';

function VisitaDetalle() {
  const { id } = useParams<{ id: string }>();
  const { visitas, cambiarEstado } = useClinica();
  const visita = visitas.find((v) => v.id === id);

  if (!visita) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonBackButton defaultHref="/visitas" />
            </IonButtons>
            <IonTitle>Visita</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <p>La visita no existe.</p>
        </IonContent>
      </IonPage>
    );
  }

  const siguiente = SIGUIENTE[visita.estado];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/visitas" />
          </IonButtons>
          <IonTitle>{visita.paciente}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel>Hora</IonLabel>
            <IonNote slot="end">{visita.hora}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Dirección</IonLabel>
            <IonNote slot="end">{visita.direccion}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Motivo</IonLabel>
            <IonNote slot="end">{visita.motivo}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Estado</IonLabel>
            <IonBadge slot="end" color={COLOR[visita.estado]}>
              {ETIQUETA[visita.estado]}
            </IonBadge>
          </IonItem>
        </IonList>

        {siguiente ? (
          <IonButton
            expand="block"
            onClick={() => cambiarEstado(visita.id, siguiente)}
          >
            Marcar como {ETIQUETA[siguiente]}
          </IonButton>
        ) : (
          <IonButton expand="block" disabled>
            Visita finalizada
          </IonButton>
        )}

        {visita.estado !== 'pendiente' && (
          <IonButton
            expand="block"
            fill="clear"
            color="medium"
            onClick={() => cambiarEstado(visita.id, 'pendiente')}
          >
            Reabrir como pendiente
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
}

export default VisitaDetalle;
