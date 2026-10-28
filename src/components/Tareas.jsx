// Componente de Tasks. Consume el custom hook useTasksRealtime (Firebase
// RealTime Database) y el estado de red.
import { useState } from 'react';
import { IonButton, IonCheckbox, IonInput, IonItem, IonList, IonText } from '@ionic/react';
import useTasksRealtime from '../hooks/useTasksRealtime';
import { useRed } from '../contexts/RedContext';

export default function Tareas() {
  const { tareas, pendientes, agregarTarea, alternarTarea, eliminarTarea, origen } =
    useTasksRealtime();
  const { sinRed } = useRed();
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');

  async function enviar(evento) {
    evento.preventDefault();
    if (sinRed) {
      setError('Sin conexión no se puede escribir en RealTime Database.');
      return;
    }
    if (!titulo.trim()) {
      setError('Escribe qué tienes pendiente.');
      return;
    }
    await agregarTarea(titulo.trim());
    setTitulo('');
    setError('');
  }

  return (
    <section>
      <div className="intro">
        <h1>Tasks</h1>
        <p>Guardadas en RealTime Database. También necesitan conexión.</p>
      </div>

      {sinRed && (
        <IonText color="danger" className="aviso" data-testid="aviso-tasks" role="status">
          Sin conexión: las acciones de Tasks están deshabilitadas porque viven en RealTime
          Database.
        </IonText>
      )}

      <form onSubmit={enviar}>
        <IonList>
          <IonItem>
            <IonInput
              label="Nueva tarea"
              labelPlacement="stacked"
              placeholder="Por ejemplo, repasar para el parcial"
              value={titulo}
              disabled={sinRed}
              maxlength={160}
              onIonInput={(evento) => setTitulo(evento.detail.value ?? '')}
            />
          </IonItem>
        </IonList>
        {error && (
          <IonText color="danger" role="alert" className="error">
            {error}
          </IonText>
        )}
        <IonButton type="submit" expand="block" disabled={sinRed} data-testid="agregar-tarea">
          Agregar tarea
        </IonButton>
      </form>

      <p className="resumen" aria-live="polite" data-testid="resumen-tasks">
        Pendientes: {pendientes} de {tareas.length} · Origen: {origen}
      </p>

      {tareas.length === 0 ? (
        <div className="vacio">
          <IonText color="medium">Todavía no hay tareas. Agrega la primera arriba.</IonText>
        </div>
      ) : (
        <IonList aria-label="Lista de tareas">
          {tareas.map((tarea) => (
            <IonItem key={tarea.id} className={tarea.completa ? 'completa' : ''}>
              <IonCheckbox
                checked={Boolean(tarea.completa)}
                disabled={sinRed}
                labelPlacement="end"
                justify="start"
                data-testid={`completar-tarea-${tarea.titulo}`}
                onIonChange={() => alternarTarea(tarea.id, !tarea.completa)}
              >
                {tarea.titulo}
              </IonCheckbox>
              <IonButton
                slot="end"
                size="small"
                fill="clear"
                color="danger"
                disabled={sinRed}
                aria-label={`Eliminar tarea ${tarea.titulo}`}
                data-testid={`eliminar-tarea-${tarea.titulo}`}
                onClick={() => eliminarTarea(tarea.id)}
              >
                Eliminar
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
    </section>
  );
}
