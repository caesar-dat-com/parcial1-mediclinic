import { IonButton, IonChip, IonLabel } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useHaptics from '../hooks/useHaptics';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('haptics');

export default function Haptics() {
  const {
    soporte,
    ultima,
    historial,
    error,
    seleccionAbierta,
    impacto,
    notificacion,
    vibrar,
    abrirSeleccion,
    cambiarSeleccion,
    cerrarSeleccion,
  } = useHaptics();

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton expand="block" data-testid="vibrar" onClick={() => vibrar(300)}>
          Vibrar 300 ms
        </IonButton>
        <div className="fila">
          <IonButton size="small" data-testid="impacto-light" onClick={() => impacto('Light')}>
            Impacto light
          </IonButton>
          <IonButton size="small" data-testid="impacto-medium" onClick={() => impacto('Medium')}>
            medium
          </IonButton>
          <IonButton size="small" data-testid="impacto-heavy" onClick={() => impacto('Heavy')}>
            heavy
          </IonButton>
        </div>
        <div className="fila">
          <IonButton size="small" fill="outline" data-testid="notif-success" onClick={() => notificacion('Success')}>
            Notif. success
          </IonButton>
          <IonButton size="small" fill="outline" data-testid="notif-warning" onClick={() => notificacion('Warning')}>
            warning
          </IonButton>
          <IonButton size="small" fill="outline" data-testid="notif-error" onClick={() => notificacion('Error')}>
            error
          </IonButton>
        </div>
        <div className="fila">
          <IonButton size="small" fill="clear" data-testid="seleccion-inicio" onClick={abrirSeleccion}>
            Selección: iniciar
          </IonButton>
          <IonButton size="small" fill="clear" data-testid="seleccion-cambio" onClick={cambiarSeleccion}>
            cambiar
          </IonButton>
          <IonButton size="small" fill="clear" data-testid="seleccion-fin" onClick={cerrarSeleccion}>
            terminar
          </IonButton>
        </div>
      </div>

      <ListaDatos
        titulo="Estado"
        datos={{
          'última acción': ultima || 'ninguna',
          'selección abierta': seleccionAbierta ? 'sí' : 'no',
        }}
        testid="datos-haptics"
      />

      {historial.length ? (
        <div className="historial" data-testid="historial-haptics">
          {historial.map((linea) => (
            <IonChip key={linea} outline>
              <IonLabel>{linea}</IonLabel>
            </IonChip>
          ))}
        </div>
      ) : (
        <Vacio texto="Pulsa cualquier botón: si la plataforma no tiene motor de vibración se avisa debajo." />
      )}

      <Aviso texto={error} tono="danger" testid="error-haptics" />
    </PanelSensor>
  );
}
