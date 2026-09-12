import { Navigate, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { calendar, people, person } from 'ionicons/icons';
import Login from './pages/Login';
import Pacientes from './pages/Pacientes';
import Perfil from './pages/Perfil';
import VisitaDetalle from './pages/VisitaDetalle';
import Visitas from './pages/Visitas';
import { ClinicaProvider, useClinica } from './context/Clinica';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

function Contenido() {
  const { medico } = useClinica();

  if (!medico) return <Login />;

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route path="/visitas" element={<Visitas />} />
          <Route path="/visitas/:id" element={<VisitaDetalle />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/" element={<Navigate to="/visitas" replace />} />
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="visitas" href="/visitas">
            <IonIcon aria-hidden="true" icon={calendar} />
            <IonLabel>Visitas</IonLabel>
          </IonTabButton>
          <IonTabButton tab="pacientes" href="/pacientes">
            <IonIcon aria-hidden="true" icon={people} />
            <IonLabel>Pacientes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="perfil" href="/perfil">
            <IonIcon aria-hidden="true" icon={person} />
            <IonLabel>Perfil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  );
}

const App: React.FC = () => (
  <IonApp>
    <ClinicaProvider>
      <Contenido />
    </ClinicaProvider>
  </IonApp>
);

export default App;
