import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonList, IonText } from '@ionic/react';

// Formulario compartido por las paginas de Login y Register. Solo maneja los campos:
// quien habla con Firebase es el custom hook que esta detras del AuthContext.
export default function FormularioCuenta({
  textoBoton,
  placeholderPassword,
  pedirConfirmacion = false,
  error = '',
  onEnviar,
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [aviso, setAviso] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setAviso('');
    if (!email.trim() || !password) {
      setAviso('Escribe tu correo y tu contraseña.');
      return;
    }
    if (pedirConfirmacion && password !== confirmacion) {
      setAviso('Las contraseñas no coinciden.');
      return;
    }
    setEnviando(true);
    await onEnviar(email, password);
    setEnviando(false);
  }

  const mensaje = aviso || error;

  return (
    <form onSubmit={enviar}>
      <IonList>
        <IonItem>
          <IonInput
            label="Correo"
            labelPlacement="stacked"
            type="email"
            autocomplete="username"
            placeholder="tucorreo@mail.com"
            value={email}
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Contraseña"
            labelPlacement="stacked"
            type="password"
            autocomplete={pedirConfirmacion ? 'new-password' : 'current-password'}
            placeholder={placeholderPassword}
            value={password}
            onIonInput={(e) => setPassword(e.detail.value ?? '')}
          />
        </IonItem>
        {pedirConfirmacion && (
          <IonItem>
            <IonInput
              label="Confirmar contraseña"
              labelPlacement="stacked"
              type="password"
              autocomplete="new-password"
              placeholder="Repite la contraseña"
              value={confirmacion}
              onIonInput={(e) => setConfirmacion(e.detail.value ?? '')}
            />
          </IonItem>
        )}
      </IonList>
      {mensaje && (
        <IonText color="danger" role="alert" className="error">
          {mensaje}
        </IonText>
      )}
      <IonButton type="submit" expand="block" disabled={enviando}>
        {enviando ? 'Un momento...' : textoBoton}
      </IonButton>
    </form>
  );
}
