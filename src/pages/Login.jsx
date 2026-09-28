import { useState } from 'react';
import { IonButton, IonContent, IonInput, IonItem, IonList, IonPage, IonText } from '@ionic/react';

export default function Login({ onEntrar }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  function enviar(event) {
    event.preventDefault();
    if (email.trim() !== 'user@mail.com' || password !== '123') {
      setError('El correo o la contraseña no coinciden. Intenta de nuevo.'); return;
    }
    onEntrar();
  }
  return <IonPage><IonContent><main className="contenido login">
    <div className="intro"><h1>Vuelve a tus pendientes</h1><p>Inicia sesión para ver tu lista de tareas.</p></div>
    <form onSubmit={enviar}>
      <IonList>
        <IonItem><IonInput label="Correo" labelPlacement="stacked" type="email" autocomplete="username"
          placeholder="user@mail.com" value={email} onIonInput={(e) => setEmail(e.detail.value ?? '')} /></IonItem>
        <IonItem><IonInput label="Contraseña" labelPlacement="stacked" type="password" autocomplete="current-password"
          value={password} onIonInput={(e) => setPassword(e.detail.value ?? '')} /></IonItem>
      </IonList>
      {error && <IonText color="danger" role="alert" className="error">{error}</IonText>}
      <IonButton type="submit" expand="block">Ingresar</IonButton>
    </form>
    <p className="resumen">Cuenta de práctica: user@mail.com / 123</p>
  </main></IonContent></IonPage>;
}
