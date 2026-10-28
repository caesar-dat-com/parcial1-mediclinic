// Cascarón de página: encabezado con título, navegación entre rutas, chip de
// estado de red y botón de cerrar sesión.
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import EstadoRed from './EstadoRed';
import NavTabs from './NavTabs';
import { useSesion } from '../contexts/SesionContext';

export default function Pantalla({ titulo, children }) {
  const { usuario, salir } = useSesion();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{titulo}</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={salir} data-testid="cerrar-sesion">
              Cerrar sesión
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <NavTabs />
          <IonButtons slot="end">
            <EstadoRed />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          {usuario?.email && (
            <p className="resumen" data-testid="usuario">
              Sesión de {usuario.email}
            </p>
          )}
          {children}
        </main>
      </IonContent>
    </IonPage>
  );
}
