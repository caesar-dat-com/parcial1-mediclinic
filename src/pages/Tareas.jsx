import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import Cargando from '../components/Cargando';
import ListaTareas from '../components/ListaTareas';
import useAuth from '../hooks/useAuth';
import useTasks from '../hooks/useTasks';

export default function Tareas() {
  const { usuario, salir } = useAuth();
  const { tareas, pendientes, cargando, error, actualizarTarea, eliminarTarea } = useTasks();
  const navegar = useNavigate();

  async function cerrarSesion() {
    await salir();
    navegar('/login', { replace: true });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Mis tareas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={cerrarSesion}>Cerrar sesión</IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          <div className="intro">
            <h1>Una cosa a la vez</h1>
            <p data-testid="correo-sesion">Sesión de {usuario?.email}</p>
          </div>
          <IonButton expand="block" onClick={() => navegar('/tasks/nueva')}>
            Nueva tarea
          </IonButton>
          {error && (
            <IonText color="danger" role="alert" className="error">
              {error}
            </IonText>
          )}
          {cargando ? (
            <Cargando mensaje="Cargando tus tareas..." />
          ) : (
            <>
              <p className="resumen" aria-live="polite">
                Pendientes: {pendientes} de {tareas.length}
              </p>
              <ListaTareas
                tareas={tareas}
                onCambiar={(id, completa) => actualizarTarea(id, { completa })}
                onEliminar={(id) => eliminarTarea(id)}
              />
            </>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}
