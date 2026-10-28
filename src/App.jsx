import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Navigate, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { TasksProvider } from './contexts/TasksContext';
import Cargando from './components/Cargando';
import useAuth from './hooks/useAuth';
import Login from './pages/Login';
import Register from './pages/Register';
import Tareas from './pages/Tareas';
import TareaEditor from './pages/TareaEditor';
import TareaDetalle from './pages/TareaDetalle';

// Las cinco rutas del enunciado: Login, Register, Tasks list, Add/Edit Task y Task Detail.
// El estado de la sesion sale del AuthContext, no de props.
function Rutas() {
  const { usuario, cargando } = useAuth();
  if (cargando) return <Cargando />;
  const privada = (pagina) => (usuario ? pagina : <Navigate to="/login" replace />);
  const publica = (pagina) => (usuario ? <Navigate to="/tasks" replace /> : pagina);

  return (
    <IonRouterOutlet>
      <Route path="/login" element={publica(<Login />)} />
      <Route path="/register" element={publica(<Register />)} />
      <Route path="/tasks" element={privada(<Tareas />)} />
      <Route path="/tasks/nueva" element={privada(<TareaEditor />)} />
      <Route path="/tasks/:id" element={privada(<TareaDetalle />)} />
      <Route path="/tasks/:id/editar" element={privada(<TareaEditor />)} />
      <Route path="*" element={<Navigate to={usuario ? '/tasks' : '/login'} replace />} />
    </IonRouterOutlet>
  );
}

export default function App() {
  return (
    <IonApp>
      <AuthProvider>
        <TasksProvider>
          <IonReactRouter>
            <Rutas />
          </IonReactRouter>
        </TasksProvider>
      </AuthProvider>
    </IonApp>
  );
}
