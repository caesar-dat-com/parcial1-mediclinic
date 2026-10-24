import { useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle,
  IonInput, IonItem, IonLabel, IonNote, IonSegment, IonSegmentButton, IonText,
} from '@ionic/react';
import type { useAuth } from '../hooks/useAuth';

type Props = { auth: ReturnType<typeof useAuth> };

export default function Login({ auth }: Props) {
  const { entrar, registrar, error, conFirebase } = auth;
  const [modo, setModo] = useState<'entrar' | 'registrar'>('entrar');
  const [email, setEmail] = useState('');
  const [clave, setClave] = useState('');
  const [aviso, setAviso] = useState<string | null>(null);

  const enviar = async () => {
    setAviso(null);
    if (!email.includes('@') || clave.length < 6) {
      setAviso('Escribe un correo válido y una contraseña de al menos 6 caracteres');
      return;
    }
    const u = modo === 'entrar' ? await entrar(email, clave) : await registrar(email, clave);
    if (!u) setAviso(null); // el error ya viene del hook
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>Misiones</IonCardTitle>
        <IonCardSubtitle>
          {conFirebase ? 'Cuentas en Firebase' : 'Cuentas guardadas en este dispositivo'}
        </IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent>
        <IonSegment value={modo} onIonChange={(e) => setModo(e.detail.value as 'entrar' | 'registrar')}>
          <IonSegmentButton value="entrar"><IonLabel>Entrar</IonLabel></IonSegmentButton>
          <IonSegmentButton value="registrar"><IonLabel>Registrarme</IonLabel></IonSegmentButton>
        </IonSegment>

        <IonItem>
          <IonLabel position="stacked">Correo</IonLabel>
          <IonInput
            value={email}
            data-test="email"
            type="email"
            placeholder="tucorreo@uao.edu.co"
            onIonInput={(e) => setEmail(e.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Contraseña</IonLabel>
          <IonInput
            value={clave}
            data-test="clave"
            type="password"
            onIonInput={(e) => setClave(e.detail.value ?? '')}
          />
        </IonItem>

        <IonButton expand="block" onClick={enviar} data-test="enviar" style={{ marginTop: 16 }}>
          {modo === 'entrar' ? 'Entrar' : 'Crear cuenta'}
        </IonButton>

        {(aviso || error) && (
          <IonText color="danger"><p data-test="error">{aviso ?? error}</p></IonText>
        )}
        <IonNote>
          <p>Los puntos quedan guardados en la cuenta, así que al volver a entrar sigue el progreso.</p>
        </IonNote>
      </IonCardContent>
    </IonCard>
  );
}
