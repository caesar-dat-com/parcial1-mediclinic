import { IonApp, IonRouterOutlet, IonSpinner } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';
import { SesionProvider, useSesion } from './contexts/SesionContext';
import { RedProvider } from './contexts/RedContext';
import Login from './pages/Login';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Fruits from './pages/Fruits';

function Rutas() {
  const { logueado, cargando } = useSesion();

  if (cargando) {
    return (
      <div className="cargando">
        <IonSpinner name="crescent" aria-label="Revisando la sesión" />
      </div>
    );
  }

  const protegida = (pagina) => (logueado ? pagina : <Navigate to="/login" replace />);

  return (
    <IonRouterOutlet>
      <Route path="/login" element={logueado ? <Navigate to="/contacts" replace /> : <Login />} />
      <Route path="/contacts" element={protegida(<Contacts />)} />
      <Route path="/tasks" element={protegida(<Tasks />)} />
      <Route path="/fruits" element={protegida(<Fruits />)} />
      <Route path="*" element={<Navigate to={logueado ? '/contacts' : '/login'} replace />} />
    </IonRouterOutlet>
  );
}

export default function App() {
  return (
    <IonApp>
      <SesionProvider>
        <RedProvider>
          <IonReactRouter>
            <Rutas />
          </IonReactRouter>
        </RedProvider>
      </SesionProvider>
    </IonApp>
  );
}
