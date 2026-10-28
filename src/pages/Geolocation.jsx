import { IonButton, IonSpinner } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useGeolocation from '../hooks/useGeolocation';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('geolocation');

export default function Geolocation() {
  const {
    soporte,
    posicion,
    permiso,
    observando,
    cargando,
    error,
    leerPosicion,
    observar,
    pedirPermiso,
  } = useGeolocation();

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton expand="block" data-testid="leer-posicion" onClick={leerPosicion} disabled={cargando}>
          {cargando ? <IonSpinner name="dots" /> : 'Obtener posición actual'}
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          color={observando ? 'danger' : 'primary'}
          data-testid="observar-posicion"
          onClick={observar}
        >
          {observando ? 'Detener seguimiento' : 'Observar cambios'}
        </IonButton>
        <IonButton expand="block" fill="clear" data-testid="permiso-posicion" onClick={pedirPermiso}>
          Pedir permiso
        </IonButton>
      </div>

      <ListaDatos titulo="Permiso" datos={{ ubicacion: permiso }} testid="permiso-geolocation" />

      {posicion ? (
        <ListaDatos titulo="Última lectura" datos={posicion} testid="datos-geolocation" />
      ) : (
        <Vacio texto="Todavía no hay lectura. Pulsa «Obtener posición actual»." />
      )}

      <Aviso texto={error} tono="danger" testid="error-geolocation" />
    </PanelSensor>
  );
}
