import { IonSpinner, IonText } from '@ionic/react';

// Pantalla de espera mientras Firebase resuelve el estado de la sesion (onAuthStateChanged).
export default function Cargando({ mensaje = 'Revisando tu sesión...' }) {
  return (
    <div className="cargando" role="status">
      <IonSpinner name="crescent" />
      <IonText color="medium">{mensaje}</IonText>
    </div>
  );
}
