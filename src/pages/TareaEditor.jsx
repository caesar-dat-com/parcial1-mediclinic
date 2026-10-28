import { useEffect, useState } from 'react';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import Cargando from '../components/Cargando';
import FormularioTarea from '../components/FormularioTarea';
import useTasks from '../hooks/useTasks';

// Una sola pagina para Add y Edit: si la ruta trae :id estamos editando, si no, creando.
export default function TareaEditor() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { crearTarea, actualizarTarea, obtenerTarea, cargarTarea, cargando, error } = useTasks();
  const [tarea, setTarea] = useState(() => (id ? obtenerTarea(id) : null));
  const [buscando, setBuscando] = useState(Boolean(id));

  useEffect(() => {
    if (!id) {
      setTarea(null);
      setBuscando(false);
      return;
    }
    const enMemoria = obtenerTarea(id);
    if (enMemoria) {
      setTarea(enMemoria);
      setBuscando(false);
      return;
    }
    if (cargando) return;
    let vivo = true;
    cargarTarea(id).then((encontrada) => {
      if (!vivo) return;
      setTarea(encontrada);
      setBuscando(false);
    });
    // eslint-disable-next-line consistent-return
    return () => {
      vivo = false;
    };
  }, [id, cargando, obtenerTarea, cargarTarea]);

  async function guardar(datos) {
    if (id) await actualizarTarea(id, datos);
    else await crearTarea(datos);
    navegar('/tasks', { replace: true });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" text="Volver" />
          </IonButtons>
          <IonTitle>{id ? 'Editar tarea' : 'Nueva tarea'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          <div className="intro">
            <h1>{id ? 'Ajusta la tarea' : 'Anota un pendiente'}</h1>
            <p>Los cambios se guardan en Firestore, en la colección del usuario que entró.</p>
          </div>
          {error && (
            <IonText color="danger" role="alert" className="error">
              {error}
            </IonText>
          )}
          {buscando ? (
            <Cargando mensaje="Buscando la tarea..." />
          ) : id && !tarea ? (
            <div className="vacio">
              <IonText color="medium">Esa tarea ya no existe.</IonText>
            </div>
          ) : (
            <FormularioTarea
              tarea={tarea}
              onGuardar={guardar}
              onCancelar={() => navegar('/tasks', { replace: true })}
            />
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}
