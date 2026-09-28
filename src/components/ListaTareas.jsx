import { IonList, IonText } from '@ionic/react';
import TareaItem from './TareaItem';

export default function ListaTareas({ tareas, onCambiar, onEliminar }) {
  if (!tareas.length) return <div className="vacio"><IonText color="medium">Todavía no hay tareas. Agrega la primera arriba.</IonText></div>;
  return <IonList aria-label="Lista de tareas">
    {tareas.map((tarea) => <TareaItem key={tarea.id} tarea={tarea} onCambiar={onCambiar} onEliminar={onEliminar} />)}
  </IonList>;
}
