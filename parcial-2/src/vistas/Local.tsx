import { useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonInput,
  IonItem, IonLabel, IonList, IonNote, IonTextarea, IonChip,
} from '@ionic/react';
import { useRegistrosLocales } from '../hooks/useRegistrosLocales';
import { useGeolocation } from '../hooks/useGeolocation';
import { useNetwork } from '../hooks/useNetwork';

export default function Local() {
  const { registros, pendientes, agregar, borrar, limpiar } = useRegistrosLocales();
  const { coords, ubicar } = useGeolocation();
  const { conectado } = useNetwork();
  const [titulo, setTitulo] = useState('');
  const [detalle, setDetalle] = useState('');

  const guardar = async () => {
    if (!titulo.trim()) return;
    await agregar({ titulo: titulo.trim(), detalle: detalle.trim(),
                    lat: coords?.lat, lng: coords?.lng });
    setTitulo('');
    setDetalle('');
  };

  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Guardar sin internet</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <p>
            Todo se guarda en IndexedDB con Dexie, así que funciona aunque el equipo esté{' '}
            {conectado ? 'conectado o no' : 'sin conexión, como ahora'}.
          </p>
          <IonItem>
            <IonLabel position="stacked">Título</IonLabel>
            <IonInput
              value={titulo}
              data-test="titulo"
              placeholder="Visita a cliente"
              onIonInput={(e) => setTitulo(e.detail.value ?? '')}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Detalle</IonLabel>
            <IonTextarea
              value={detalle}
              data-test="detalle"
              rows={2}
              onIonInput={(e) => setDetalle(e.detail.value ?? '')}
            />
          </IonItem>
          <IonButton onClick={() => ubicar()} fill="outline" size="small">
            Adjuntar ubicación
          </IonButton>
          {coords && <IonChip>{coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</IonChip>}
          <IonButton expand="block" onClick={guardar} data-test="guardar">
            Guardar
          </IonButton>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader>
          <IonCardTitle>
            Registros ({registros.length}){' '}
            {pendientes > 0 && <IonChip color="warning">{pendientes} por subir</IonChip>}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonList data-test="lista">
            {registros.map((r) => (
              <IonItem key={r.id}>
                <IonLabel>
                  <h3>{r.titulo}</h3>
                  <p>{r.detalle}</p>
                  <IonNote>
                    {new Date(r.creado).toLocaleString('es-CO')}
                    {r.lat != null && ` · ${r.lat.toFixed(3)}, ${r.lng?.toFixed(3)}`}
                  </IonNote>
                </IonLabel>
                <IonButton slot="end" fill="clear" color="danger" onClick={() => borrar(r.id!)}>
                  Borrar
                </IonButton>
              </IonItem>
            ))}
            {registros.length === 0 && <IonNote>Todavía no hay registros guardados.</IonNote>}
          </IonList>
          {registros.length > 0 && (
            <IonButton fill="clear" color="medium" onClick={limpiar}>Vaciar todo</IonButton>
          )}
        </IonCardContent>
      </IonCard>
    </>
  );
}
