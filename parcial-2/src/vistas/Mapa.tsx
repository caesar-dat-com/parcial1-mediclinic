import { useEffect } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonNote } from '@ionic/react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useGeolocation } from '../hooks/useGeolocation';

// Leaflet busca los iconos por ruta relativa y con Vite no los encuentra: los fijo por URL.
const icono = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

/** Centra el mapa cuando llega una posición nueva. */
function Centrar({ lat, lng }: { lat: number; lng: number }) {
  const mapa = useMap();
  useEffect(() => {
    mapa.setView([lat, lng], 15);
  }, [lat, lng, mapa]);
  return null;
}

const CALI: [number, number] = [3.4516, -76.532];

export default function Mapa() {
  const { coords, cargando, error, ubicar } = useGeolocation({ seguir: true });
  const centro: [number, number] = coords ? [coords.lat, coords.lng] : CALI;

  return (
    <IonCard>
      <IonCardHeader><IonCardTitle>Dónde estoy</IonCardTitle></IonCardHeader>
      <IonCardContent>
        <IonButton onClick={() => ubicar()} disabled={cargando} size="small">
          {cargando ? 'Ubicando…' : 'Centrar en mi posición'}
        </IonButton>
        {error && <IonNote color="danger"><p>{error}</p></IonNote>}
        <div style={{ height: 360, marginTop: 12, borderRadius: 8, overflow: 'hidden' }}>
          <MapContainer center={centro} zoom={13} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; OpenStreetMap'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {coords && (
              <>
                <Marker position={[coords.lat, coords.lng]} icon={icono}>
                  <Popup>Estoy aquí (±{Math.round(coords.precision)} m)</Popup>
                </Marker>
                <Centrar lat={coords.lat} lng={coords.lng} />
              </>
            )}
          </MapContainer>
        </div>
        <IonNote>
          <p>
            {coords
              ? `Lat ${coords.lat.toFixed(5)} · Lng ${coords.lng.toFixed(5)}`
              : 'Sin permiso de ubicación todavía: el mapa muestra Cali por defecto.'}
          </p>
        </IonNote>
      </IonCardContent>
    </IonCard>
  );
}
