import { useState } from 'react';
import { IonButton, IonChip, IonInput, IonItem, IonLabel, IonList, IonListHeader } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useLocalNotifications from '../hooks/useLocalNotifications';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('local-notifications');

export default function LocalNotifications() {
  const {
    soporte,
    permiso,
    pendientes,
    recibidas,
    aviso,
    error,
    programar,
    cancelar,
    cancelarTodas,
    pedirPermiso,
  } = useLocalNotifications();
  const [titulo, setTitulo] = useState('Recordatorio del Challenge 07');
  const [segundos, setSegundos] = useState(10);

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <IonList>
        <IonItem>
          <IonInput
            label="Título"
            labelPlacement="stacked"
            value={titulo}
            data-testid="titulo-notificacion"
            onIonInput={(evento) => setTitulo(evento.detail.value ?? '')}
          />
        </IonItem>
        <IonItem>
          <IonInput
            label="Dentro de (segundos)"
            labelPlacement="stacked"
            type="number"
            min={1}
            value={segundos}
            data-testid="segundos-notificacion"
            onIonInput={(evento) => setSegundos(Number(evento.detail.value) || 10)}
          />
        </IonItem>
      </IonList>

      <div className="acciones">
        <IonButton
          expand="block"
          data-testid="programar-notificacion"
          onClick={() => programar(titulo, 'Programada desde useLocalNotifications.', segundos)}
        >
          Programar notificación
        </IonButton>
        <IonButton expand="block" fill="outline" data-testid="permiso-notificacion" onClick={pedirPermiso}>
          Pedir permiso
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          color="danger"
          data-testid="cancelar-todas"
          onClick={cancelarTodas}
        >
          Cancelar todas
        </IonButton>
      </div>

      <ListaDatos
        titulo="Estado"
        datos={{ permiso, pendientes: pendientes.length }}
        testid="datos-local-notifications"
      />

      {pendientes.length ? (
        <IonList data-testid="lista-pendientes">
          <IonListHeader>Pendientes</IonListHeader>
          {pendientes.map((notificacion) => (
            <IonItem key={notificacion.id}>
              <IonLabel>
                <h3>
                  #{notificacion.id} {notificacion.titulo}
                </h3>
                <p>{notificacion.cuando}</p>
              </IonLabel>
              <IonButton
                slot="end"
                size="small"
                fill="outline"
                color="danger"
                data-testid={`cancelar-${notificacion.id}`}
                onClick={() => cancelar(notificacion.id)}
              >
                Cancelar
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      ) : (
        <Vacio texto="No hay notificaciones pendientes." />
      )}

      {recibidas.length > 0 && (
        <div className="historial" data-testid="recibidas-local">
          {recibidas.map((linea) => (
            <IonChip key={linea} outline>
              <IonLabel>{linea}</IonLabel>
            </IonChip>
          ))}
        </div>
      )}

      <Aviso texto={aviso} testid="aviso-local-notifications" />
      <Aviso texto={error} tono="danger" testid="error-local-notifications" />
    </PanelSensor>
  );
}
