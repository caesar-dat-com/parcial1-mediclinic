import { useState } from 'react';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonNote,
  IonPage,
  IonText,
  IonToast,
} from '@ionic/react';
import { useClinica } from '../context/Clinica';
import './Login.css';

function Login() {
  const { entrar } = useClinica();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarToast, setMostrarToast] = useState(false);

  const ingresar = () => {
    if (!entrar(usuario, password)) setMostrarToast(true);
  };

  return (
    <IonPage>
      <IonContent className="ion-padding login-fondo">
        <div className="login-caja">
          <h1>MediClinic</h1>
          <IonNote>Agenda de visitas médicas</IonNote>

          <IonList inset>
            <IonItem>
              <IonInput
                label="Usuario"
                labelPlacement="stacked"
                placeholder="medico@mediclinic.com"
                value={usuario}
                onIonInput={(e) => setUsuario(e.detail.value ?? '')}
              />
            </IonItem>
            <IonItem>
              <IonInput
                label="Contraseña"
                labelPlacement="stacked"
                type="password"
                value={password}
                onIonInput={(e) => setPassword(e.detail.value ?? '')}
              />
            </IonItem>
          </IonList>

          <IonButton expand="block" onClick={ingresar}>
            Ingresar
          </IonButton>

          <IonText color="medium">
            <p className="pista">Demo: medico@mediclinic.com / 123</p>
          </IonText>
        </div>

        <IonToast
          isOpen={mostrarToast}
          message="Usuario o contraseña incorrectos"
          duration={2000}
          color="danger"
          position="top"
          onDidDismiss={() => setMostrarToast(false)}
        />
      </IonContent>
    </IonPage>
  );
}

export default Login;
