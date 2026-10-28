import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import EstadoSoporte from './EstadoSoporte';

// Carcasa común de las ocho páginas de sensor: cabecera con regreso a la Home,
// datos del plugin, estado de disponibilidad y el contenido propio del sensor.
export default function PanelSensor({ sensor, soporte, children }) {
  return (
    <IonPage data-testid={`pagina-${sensor.slug}`}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/" text="Inicio" data-testid="volver" />
          </IonButtons>
          <IonTitle>{sensor.titulo}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          <div className="intro">
            <h1 data-testid="titulo-sensor">{sensor.titulo}</h1>
            <p>{sensor.resumen}</p>
            <p className="plugin">
              <code>{sensor.plugin}</code> · hook <code>{sensor.hook}</code>
            </p>
          </div>
          <EstadoSoporte soporte={soporte} />
          {children}
        </main>
      </IonContent>
    </IonPage>
  );
}
