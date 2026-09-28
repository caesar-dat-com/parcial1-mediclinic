import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonList, IonText } from '@ionic/react';

export default function TareaForm({ onAgregar }) {
  const [titulo, setTitulo] = useState('');
  const [error, setError] = useState('');
  function enviar(event) {
    event.preventDefault();
    if (!titulo.trim()) { setError('Escribe qué tienes pendiente.'); return; }
    onAgregar(titulo.trim());
    setTitulo('');
    setError('');
  }
  return <form onSubmit={enviar}>
    <IonList><IonItem>
      <IonInput label="Nueva tarea" labelPlacement="stacked" placeholder="Por ejemplo, repasar para el parcial"
        value={titulo} maxlength={160} onIonInput={(e) => setTitulo(e.detail.value ?? '')} />
    </IonItem></IonList>
    {error && <IonText color="danger" role="alert" className="error">{error}</IonText>}
    <IonButton type="submit" expand="block">Agregar tarea</IonButton>
  </form>;
}
