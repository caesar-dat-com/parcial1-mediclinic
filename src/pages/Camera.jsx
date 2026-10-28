import { useRef } from 'react';
import { IonButton, IonSpinner } from '@ionic/react';
import PanelSensor from '../components/PanelSensor';
import { Aviso, ListaDatos, Vacio } from '../components/Datos';
import useCamera from '../hooks/useCamera';
import { buscarSensor } from '../sensores';

const SENSOR = buscarSensor('camera');

export default function Camera() {
  const { soporte, foto, origen, cargando, error, tomarFoto, elegirDeGaleria, usarArchivo, borrarFoto } =
    useCamera();
  const entrada = useRef(null);

  return (
    <PanelSensor sensor={SENSOR} soporte={soporte}>
      <div className="acciones">
        <IonButton expand="block" data-testid="tomar-foto" onClick={tomarFoto} disabled={cargando}>
          {cargando ? <IonSpinner name="dots" /> : 'Tomar foto'}
        </IonButton>
        <IonButton expand="block" fill="outline" data-testid="elegir-galeria" onClick={elegirDeGaleria}>
          Elegir de la galería
        </IonButton>
        <IonButton
          expand="block"
          fill="clear"
          data-testid="respaldo-archivo"
          onClick={() => entrada.current?.click()}
        >
          Respaldo web: subir imagen
        </IonButton>
        {foto && (
          <IonButton expand="block" fill="clear" color="danger" data-testid="borrar-foto" onClick={borrarFoto}>
            Quitar imagen
          </IonButton>
        )}
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/*"
        hidden
        data-testid="entrada-archivo"
        onChange={(evento) => usarArchivo(evento.target.files?.[0])}
      />

      {foto ? (
        <>
          <img className="foto" src={foto.src} alt="Imagen obtenida con el sensor de cámara" data-testid="foto" />
          <ListaDatos
            titulo="Imagen"
            datos={{ origen, formato: foto.formato, nombre: foto.nombre, peso: foto.peso }}
            testid="datos-camera"
          />
        </>
      ) : (
        <Vacio texto="Sin imagen todavía. En el navegador el respaldo con input type=file es la vía fiable." />
      )}

      <Aviso texto={error} tono="danger" testid="error-camera" />
    </PanelSensor>
  );
}
