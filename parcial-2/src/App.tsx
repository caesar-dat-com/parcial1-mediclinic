import { useState } from 'react';
import {
  IonApp, IonBadge, IonContent, IonHeader, IonLabel, IonSegment,
  IonSegmentButton, IonTitle, IonToolbar,
} from '@ionic/react';
import { useNetwork } from './hooks/useNetwork';
import Sensores from './vistas/Sensores';
import Local from './vistas/Local';
import Mapa from './vistas/Mapa';
import Api from './vistas/Api';
import Nube from './vistas/Nube';

type Vista = 'sensores' | 'local' | 'mapa' | 'api' | 'nube';

export default function App() {
  const [vista, setVista] = useState<Vista>('sensores');
  const { conectado, tipo } = useNetwork();

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Parcial 2 — Móviles</IonTitle>
          <IonBadge slot="end" color={conectado ? 'success' : 'medium'} style={{ marginRight: 12 }}>
            {conectado ? tipo : 'sin conexión'}
          </IonBadge>
        </IonToolbar>
        <IonToolbar>
          <IonSegment value={vista} onIonChange={(e) => setVista(e.detail.value as Vista)}>
            <IonSegmentButton value="sensores"><IonLabel>Sensores</IonLabel></IonSegmentButton>
            <IonSegmentButton value="local"><IonLabel>Local</IonLabel></IonSegmentButton>
            <IonSegmentButton value="mapa"><IonLabel>Mapa</IonLabel></IonSegmentButton>
            <IonSegmentButton value="api"><IonLabel>API</IonLabel></IonSegmentButton>
            <IonSegmentButton value="nube"><IonLabel>Nube</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {vista === 'sensores' && <Sensores />}
        {vista === 'local' && <Local />}
        {vista === 'mapa' && <Mapa />}
        {vista === 'api' && <Api />}
        {vista === 'nube' && <Nube />}
      </IonContent>
    </IonApp>
  );
}
