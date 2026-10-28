import { IonButton, IonSpinner } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useDevice from '../hooks/useDevice';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('device');

export default function Device() {
  const { soporte, info, identificador, idioma, bateria, avisoBateria, cargando, error, consultar, leerBateria } =
    useDevice();

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton expand="block" data-testid="consultar-device" onClick={consultar} disabled={cargando}>
          {cargando ? <IonSpinner name="dots" /> : 'Volver a consultar'}
        </IonButton>
        <IonButton expand="block" fill="outline" data-testid="bateria-device" onClick={leerBateria}>
          Leer batería
        </IonButton>
      </div>

      {info ? (
        <ListaDatos titulo="Dispositivo" datos={info} testid="datos-device" />
      ) : (
        <Vacio texto="Consultando la información del dispositivo…" />
      )}

      <ListaDatos
        titulo="Identificador e idioma"
        datos={{
          identificador,
          'código de idioma': idioma?.codigo,
          'etiqueta de idioma': idioma?.etiqueta,
        }}
        testid="datos-identidad"
      />

      {bateria ? (
        <ListaDatos titulo="Batería" datos={bateria} testid="datos-bateria" />
      ) : (
        <Vacio texto={avisoBateria || 'Sin datos de batería todavía.'} />
      )}

      <Aviso texto={error} tono="danger" testid="error-device" />
    </PanelSensor>
  );
}
