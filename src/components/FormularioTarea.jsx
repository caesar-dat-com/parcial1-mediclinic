import { useEffect, useState } from 'react';
import { IonButton, IonInput, IonItem, IonList, IonText, IonTextarea } from '@ionic/react';

// Formulario de crear/editar tarea. Recibe la tarea inicial (si se esta editando) y devuelve
// los datos; el guardado lo hace el custom hook de Firestore a traves del TasksContext.
export default function FormularioTarea({ tarea = null, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState(tarea?.titulo ?? '');
  const [detalle, setDetalle] = useState(tarea?.detalle ?? '');
  const [aviso, setAviso] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    setTitulo(tarea?.titulo ?? '');
    setDetalle(tarea?.detalle ?? '');
  }, [tarea?.id, tarea?.titulo, tarea?.detalle]);

  async function enviar(evento) {
    evento.preventDefault();
    if (!titulo.trim()) {
      setAviso('Escribe qué tienes pendiente.');
      return;
    }
    setAviso('');
    setGuardando(true);
    await onGuardar({ titulo: titulo.trim(), detalle: detalle.trim() });
    setGuardando(false);
  }

  return (
    <form onSubmit={enviar}>
      <IonList>
        <IonItem>
          <IonInput
            label="Título"
            labelPlacement="stacked"
            placeholder="Por ejemplo, repasar para el parcial"
            value={titulo}
            maxlength={160}
            onIonInput={(e) => setTitulo(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonTextarea
            label="Detalle"
            labelPlacement="stacked"
            placeholder="Agrega una nota (opcional)"
            autoGrow
            rows={3}
            value={detalle}
            maxlength={500}
            onIonInput={(e) => setDetalle(e.detail.value ?? '')}
          />
        </IonItem>
      </IonList>
      {aviso && (
        <IonText color="danger" role="alert" className="error">
          {aviso}
        </IonText>
      )}
      <IonButton type="submit" expand="block" disabled={guardando}>
        {tarea ? 'Guardar cambios' : 'Crear tarea'}
      </IonButton>
      <IonButton type="button" expand="block" fill="clear" onClick={onCancelar}>
        Cancelar
      </IonButton>
    </form>
  );
}
