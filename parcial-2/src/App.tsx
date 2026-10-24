import { useState } from 'react';
import {
  IonApp, IonBadge, IonButton, IonContent, IonHeader, IonLabel, IonSegment,
  IonSegmentButton, IonSpinner, IonTitle, IonToolbar,
} from '@ionic/react';
import { useAuth } from './hooks/useAuth';
import { useMisiones } from './hooks/useMisiones';
import { useNetwork } from './hooks/useNetwork';
import Login from './vistas/Login';
import Misiones from './vistas/Misiones';
import Resultados from './vistas/Resultados';
import Ranking from './vistas/Ranking';

type Vista = 'misiones' | 'resultados' | 'ranking';

export default function App() {
  // un solo useAuth para toda la app: Login recibe el mismo control por props
  const auth = useAuth();
  const { usuario, cargando, salir } = auth;
  const control = useMisiones(usuario);
  const { conectado } = useNetwork();
  const [vista, setVista] = useState<Vista>('misiones');

  return (
    <IonApp>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Misiones</IonTitle>
          <IonBadge slot="end" color={conectado ? 'success' : 'medium'} style={{ marginRight: 8 }}>
            {conectado ? 'en línea' : 'sin conexión'}
          </IonBadge>
          {usuario && (
            <IonButton slot="end" fill="clear" size="small" onClick={salir} data-test="salir">
              Salir
            </IonButton>
          )}
        </IonToolbar>
        {usuario && (
          <IonToolbar>
            <IonSegment value={vista} onIonChange={(e) => setVista(e.detail.value as Vista)}>
              <IonSegmentButton value="misiones"><IonLabel>Misiones</IonLabel></IonSegmentButton>
              <IonSegmentButton value="resultados"><IonLabel>Resultados</IonLabel></IonSegmentButton>
              <IonSegmentButton value="ranking"><IonLabel>Ranking</IonLabel></IonSegmentButton>
            </IonSegment>
          </IonToolbar>
        )}
      </IonHeader>

      <IonContent className="ion-padding">
        {cargando && <IonSpinner />}
        {!cargando && !usuario && <Login auth={auth} />}
        {!cargando && usuario && (
          <>
            {vista === 'misiones' && <Misiones control={control} />}
            {vista === 'resultados' && <Resultados control={control} correo={usuario.email} />}
            {vista === 'ranking' && <Ranking usuario={usuario} puntos={control.puntos} />}
          </>
        )}
      </IonContent>
    </IonApp>
  );
}
