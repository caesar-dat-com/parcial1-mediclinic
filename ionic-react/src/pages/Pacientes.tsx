import {
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useState } from 'react';
import { useClinica } from '../context/Clinica';

function Pacientes() {
  const { pacientes } = useClinica();
  const [busqueda, setBusqueda] = useState('');

  const termino = busqueda.trim().toLowerCase();
  const filtrados = termino
    ? pacientes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.apellido.toLowerCase().includes(termino) ||
          p.cc.includes(termino)
      )
    : pacientes;

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Pacientes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          value={busqueda}
          placeholder="Nombre, apellido o CC"
          onIonInput={(e) => setBusqueda(e.detail.value ?? '')}
        />
        <IonList>
          {filtrados.map((p) => (
            <IonItem key={p.id}>
              <IonLabel>
                <h2>
                  {p.nombre} {p.apellido}
                </h2>
                <IonNote>CC {p.cc}</IonNote>
              </IonLabel>
              <IonNote slot="end">{p.telefono}</IonNote>
            </IonItem>
          ))}
          {filtrados.length === 0 && (
            <IonItem lines="none">
              <IonLabel color="medium">Sin coincidencias</IonLabel>
            </IonItem>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
}

export default Pacientes;
