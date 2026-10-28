import { IonButton, IonCheckbox, IonItem, IonLabel } from '@ionic/react';
import { useNavigate } from 'react-router-dom';

export default function TareaItem({ tarea, onCambiar, onEliminar }) {
  const navegar = useNavigate();
  return (
    <IonItem className={tarea.completa ? 'completa' : ''}>
      <IonCheckbox
        slot="start"
        checked={tarea.completa}
        aria-label={`Marcar ${tarea.titulo}`}
        onIonChange={() => onCambiar(tarea.id, !tarea.completa)}
      />
      <IonLabel className="titulo-tarea">{tarea.titulo}</IonLabel>
      <IonButton
        slot="end"
        fill="clear"
        aria-label={`Ver ${tarea.titulo}`}
        onClick={() => navegar(`/tasks/${tarea.id}`)}
      >
        Ver
      </IonButton>
      <IonButton
        slot="end"
        fill="clear"
        color="danger"
        aria-label={`Eliminar ${tarea.titulo}`}
        onClick={() => onEliminar(tarea.id)}
      >
        Eliminar
      </IonButton>
    </IonItem>
  );
}
