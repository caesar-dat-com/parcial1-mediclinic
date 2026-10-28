import { IonContent, IonHeader, IonNote, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import BotonSensor from '../components/BotonSensor';
import { SENSORES } from '../sensores';

// Home Page: un botón por cada sensor que lleva a su propia página.
export default function Home() {
  const navigate = useNavigate();
  return (
    <IonPage data-testid="pagina-home">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Challenge 07 · Sensors</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          <div className="intro">
            <h1>Sensores del dispositivo</h1>
            <p>
              Los ocho sensores de la Clase 08. Cada botón abre una página que implementa su plugin
              de Capacitor desde su propio custom hook.
            </p>
          </div>
          <div className="rejilla" data-testid="botones-sensores">
            {SENSORES.map((sensor) => (
              <BotonSensor
                key={sensor.slug}
                sensor={sensor}
                onAbrir={(elegido) => navigate(`/sensor/${elegido.slug}`)}
              />
            ))}
          </div>
          <IonNote className="vacio" data-testid="total-sensores">
            {SENSORES.length} sensores implementados
          </IonNote>
        </main>
      </IonContent>
    </IonPage>
  );
}
