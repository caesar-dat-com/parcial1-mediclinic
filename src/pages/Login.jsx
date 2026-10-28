import { useState } from 'react';
import { IonButton, IonContent, IonInput, IonItem, IonList, IonPage, IonText } from '@ionic/react';
import { useSesion } from '../contexts/SesionContext';
import EstadoRed from '../components/EstadoRed';

export default function Login() {
  const { entrar, registrar, error, modo } = useSesion();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ocupado, setOcupado] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setOcupado(true);
    await entrar(email, password);
    setOcupado(false);
  }

  async function crearCuenta() {
    setOcupado(true);
    await registrar(email, password);
    setOcupado(false);
  }

  return (
    <IonPage>
      <IonContent>
        <main className="contenido login">
          <div className="intro">
            <h1>Challenge 06</h1>
            <p>Entra para administrar Contacts, Tasks y Fruits.</p>
          </div>
          <form onSubmit={enviar}>
            <IonList>
              <IonItem>
                <IonInput
                  label="Correo"
                  labelPlacement="stacked"
                  type="email"
                  autocomplete="username"
                  placeholder="user@mail.com"
                  value={email}
                  onIonInput={(evento) => setEmail(evento.detail.value ?? '')}
                />
              </IonItem>
              <IonItem>
                <IonInput
                  label="Contraseña"
                  labelPlacement="stacked"
                  type="password"
                  autocomplete="current-password"
                  value={password}
                  onIonInput={(evento) => setPassword(evento.detail.value ?? '')}
                />
              </IonItem>
            </IonList>
            {error && (
              <IonText color="danger" role="alert" className="error">
                {error}
              </IonText>
            )}
            <IonButton type="submit" expand="block" disabled={ocupado} data-testid="ingresar">
              Ingresar
            </IonButton>
            {modo === 'firebase' && (
              <IonButton
                expand="block"
                fill="clear"
                disabled={ocupado}
                onClick={crearCuenta}
                data-testid="crear-cuenta"
              >
                Crear cuenta
              </IonButton>
            )}
          </form>
          <p className="resumen" data-testid="modo-auth">
            {modo === 'firebase'
              ? 'Autenticación: Firebase Auth'
              : 'Autenticación: modo local (cuenta de práctica user@mail.com / 123)'}
          </p>
          <EstadoRed />
        </main>
      </IonContent>
    </IonPage>
  );
}
