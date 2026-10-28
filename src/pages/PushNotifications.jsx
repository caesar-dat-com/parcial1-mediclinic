import { IonButton, IonChip, IonLabel } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import usePushNotifications from '../hooks/usePushNotifications';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('push-notifications');

export default function PushNotifications() {
  const {
    soporte,
    disponible,
    token,
    permiso,
    registrado,
    recibidas,
    entregadas,
    aviso,
    error,
    registrar,
    consultarEntregadas,
    limpiarEntregadas,
  } = usePushNotifications();

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton expand="block" data-testid="registrar-push" onClick={registrar}>
          Registrar dispositivo
        </IonButton>
        <IonButton expand="block" fill="outline" data-testid="entregadas-push" onClick={consultarEntregadas}>
          Ver notificaciones entregadas
        </IonButton>
        <IonButton expand="block" fill="clear" color="danger" data-testid="limpiar-push" onClick={limpiarEntregadas}>
          Vaciar bandeja
        </IonButton>
      </div>

      <ListaDatos
        titulo="Estado"
        datos={{
          'implementación disponible': disponible ? 'sí' : 'no',
          permiso,
          registrado: registrado ? 'sí' : 'no',
          token: token || '—',
        }}
        testid="datos-push-notifications"
      />

      {entregadas.length ? (
        <ListaDatos
          titulo="Entregadas"
          datos={Object.fromEntries(entregadas.map((n) => [`#${n.id}`, `${n.titulo} · ${n.cuerpo}`]))}
          testid="lista-entregadas"
        />
      ) : (
        <Vacio texto="Sin notificaciones entregadas: en el navegador este plugin no tiene implementación." />
      )}

      {recibidas.length > 0 && (
        <div className="historial" data-testid="recibidas-push">
          {recibidas.map((linea) => (
            <IonChip key={linea} outline>
              <IonLabel>{linea}</IonLabel>
            </IonChip>
          ))}
        </div>
      )}

      <Aviso texto={aviso} testid="aviso-push-notifications" />
      <Aviso texto={error} tono="danger" testid="error-push-notifications" />
    </PanelSensor>
  );
}
