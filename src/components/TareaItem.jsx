import { IonButton, IonCheckbox, IonItem } from '@ionic/react';

export default function TareaItem({ tarea, onCambiar, onEliminar }) {
  return <IonItem className={tarea.completa ? 'completa' : ''}>
    <IonCheckbox checked={tarea.completa} onIonChange={() => onCambiar(tarea.id)}
      labelPlacement="end" justify="start">{tarea.titulo}</IonCheckbox>
    <IonButton slot="end" fill="clear" color="danger" aria-label={`Eliminar ${tarea.titulo}`}
      onClick={() => onEliminar(tarea.id)}>Eliminar</IonButton>
  </IonItem>;
}
