import {
  IonButton,
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
import { useClinica } from '../context/Clinica';

function Perfil() {
  const { medico, visitas, salir } = useClinica();
  const finalizadas = visitas.filter((v) => v.estado === 'finalizada').length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList inset>
          <IonItem>
            <IonLabel>Médico</IonLabel>
            <IonNote slot="end">{medico?.nombre}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Especialidad</IonLabel>
            <IonNote slot="end">{medico?.especialidad}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Usuario</IonLabel>
            <IonNote slot="end">{medico?.usuario}</IonNote>
          </IonItem>
          <IonItem>
            <IonLabel>Visitas finalizadas hoy</IonLabel>
            <IonNote slot="end">
              {finalizadas} / {visitas.length}
            </IonNote>
          </IonItem>
        </IonList>

        <IonButton expand="block" color="danger" onClick={salir}>
          Cerrar sesión
        </IonButton>
      </IonContent>
    </IonPage>
  );
}

export default Perfil;
