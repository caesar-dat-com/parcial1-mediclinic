import { useState } from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';
import Login from './pages/Login';
import Tareas from './pages/Tareas';

export default function App() {
  const [logged, setLogged] = useState(() => localStorage.getItem('logged') === 'true');
  function entrar() { localStorage.setItem('logged', 'true'); setLogged(true); }
  function salir() { localStorage.removeItem('logged'); setLogged(false); }
  return <IonApp><IonReactRouter><IonRouterOutlet>
    <Route path="/login" element={logged ? <Navigate to="/list" replace /> : <Login onEntrar={entrar} />} />
    <Route path="/list" element={logged ? <Tareas onSalir={salir} /> : <Navigate to="/login" replace />} />
    <Route path="*" element={<Navigate to={logged ? '/list' : '/login'} replace />} />
  </IonRouterOutlet></IonReactRouter></IonApp>;
}
