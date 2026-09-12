import {
  IonContent,
  IonHeader,
  IonList,
  IonListHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import VisitaItem from '../components/VisitaItem';
import { useClinica } from '../context/Clinica';

function Visitas() {
  const { visitas } = useClinica();
  const ordenadas = [...visitas].sort((a, b) => a.hora.localeCompare(b.hora));
  const pendientes = ordenadas.filter((v) => v.estado !== 'finalizada').length;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Visitas del día</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonListHeader>
            {pendientes} sin finalizar de {ordenadas.length}
          </IonListHeader>
          {ordenadas.map((v) => (
            <VisitaItem key={v.id} visita={v} />
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Visitas;
