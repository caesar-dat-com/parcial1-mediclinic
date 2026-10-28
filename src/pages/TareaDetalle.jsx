import { useEffect, useState } from 'react';
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonNote,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { useNavigate, useParams } from 'react-router-dom';
import Cargando from '../components/Cargando';
import useTasks from '../hooks/useTasks';

function fecha(valor) {
  if (!valor) return 'sin fecha';
  const momento = typeof valor?.toDate === 'function' ? valor.toDate() : new Date(valor);
  if (Number.isNaN(momento.getTime())) return 'sin fecha';
  return momento.toLocaleString('es-CO');
}

export default function TareaDetalle() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { obtenerTarea, cargarTarea, actualizarTarea, eliminarTarea, cargando, error } = useTasks();
  const [tarea, setTarea] = useState(() => obtenerTarea(id));
  const [buscando, setBuscando] = useState(!obtenerTarea(id));

  useEffect(() => {
    const enMemoria = obtenerTarea(id);
    if (enMemoria) {
      setTarea(enMemoria);
      setBuscando(false);
      return undefined;
    }
    if (cargando) return undefined;
    let vivo = true;
    cargarTarea(id).then((encontrada) => {
      if (!vivo) return;
      setTarea(encontrada);
      setBuscando(false);
    });
    return () => {
      vivo = false;
    };
  }, [id, cargando, obtenerTarea, cargarTarea]);

  async function borrar() {
    await eliminarTarea(id);
    navegar('/tasks', { replace: true });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tasks" text="Volver" />
          </IonButtons>
          <IonTitle>Detalle</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <main className="contenido">
          {error && (
            <IonText color="danger" role="alert" className="error">
              {error}
            </IonText>
          )}
          {buscando ? (
            <Cargando mensaje="Buscando la tarea..." />
          ) : !tarea ? (
            <div className="vacio">
              <IonText color="medium">Esa tarea ya no existe.</IonText>
            </div>
          ) : (
            <>
              <div className="intro">
                <h1 data-testid="detalle-titulo">{tarea.titulo}</h1>
                <IonNote data-testid="detalle-estado">
                  {tarea.completa ? 'Completa' : 'Pendiente'} · creada el {fecha(tarea.creada)}
                </IonNote>
              </div>
              <p className="detalle-texto" data-testid="detalle-detalle">
                {tarea.detalle || 'Esta tarea no tiene notas.'}
              </p>
              <IonButton expand="block" onClick={() => navegar(`/tasks/${id}/editar`)}>
                Editar tarea
              </IonButton>
              <IonButton
                expand="block"
                fill="outline"
                onClick={() => actualizarTarea(id, { completa: !tarea.completa })}
              >
                {tarea.completa ? 'Marcar como pendiente' : 'Marcar como completa'}
              </IonButton>
              <IonButton expand="block" fill="clear" color="danger" onClick={borrar}>
                Eliminar tarea
              </IonButton>
            </>
          )}
        </main>
      </IonContent>
    </IonPage>
  );
}
