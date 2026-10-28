import { IonButton } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useMotion from '../hooks/useMotion';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('motion');

export default function Motion() {
  const { soporte, aceleracion, orientacion, eventos, escuchando, permiso, error, escuchar, reiniciar } =
    useMotion();

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton
          expand="block"
          color={escuchando ? 'danger' : 'primary'}
          data-testid="escuchar-motion"
          onClick={escuchar}
        >
          {escuchando ? 'Detener listeners' : 'Escuchar accel y orientation'}
        </IonButton>
        <IonButton expand="block" fill="clear" data-testid="reiniciar-motion" onClick={reiniciar}>
          Limpiar lecturas
        </IonButton>
      </div>

      <ListaDatos
        titulo="Estado"
        datos={{
          escuchando: escuchando ? 'sí' : 'no',
          permiso,
          'eventos accel': eventos.accel,
          'eventos orientation': eventos.orientation,
        }}
        testid="estado-motion"
      />

      {aceleracion ? (
        <ListaDatos titulo="Acelerómetro (accel)" datos={aceleracion} testid="datos-accel" />
      ) : (
        <Vacio texto="Sin datos de accel: un escritorio no tiene acelerómetro, hace falta un teléfono." />
      )}

      {orientacion ? (
        <ListaDatos titulo="Orientación (orientation)" datos={orientacion} testid="datos-orientation" />
      ) : (
        <Vacio texto="Sin datos de orientation por el mismo motivo." />
      )}

      <Aviso texto={error} tono="danger" testid="error-motion" />
    </PanelSensor>
  );
}
