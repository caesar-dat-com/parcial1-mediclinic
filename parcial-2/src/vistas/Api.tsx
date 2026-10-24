import { useEffect } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonList, IonNote, IonSpinner,
} from '@ionic/react';
import { useApi } from '../hooks/useApi';

type Publicacion = { id: number; title: string; body: string };

export default function Api() {
  const api = useApi<Publicacion[]>('https://jsonplaceholder.typicode.com');
  const unico = useApi<Publicacion>('https://jsonplaceholder.typicode.com');

  useEffect(() => {
    api.get('/posts?_limit=5');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <IonCard>
        <IonCardHeader><IonCardTitle>GET</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton size="small" onClick={() => api.get('/posts?_limit=5')}>
            Recargar
          </IonButton>
          {api.cargando && <IonSpinner />}
          {api.error && <IonNote color="danger"><p>{api.error}</p></IonNote>}
          <IonList data-test="posts">
            {(api.datos ?? []).map((p) => (
              <IonItem key={p.id}>
                <IonLabel>
                  <h3>{p.title}</h3>
                  <IonNote>{p.body.slice(0, 70)}…</IonNote>
                </IonLabel>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>POST, PUT y DELETE</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonButton size="small" onClick={() => unico.post('/posts', { title: 'Parcial 2', body: 'Creado desde la app', userId: 1 })}>
            POST
          </IonButton>
          <IonButton size="small" fill="outline" onClick={() => unico.put('/posts/1', { id: 1, title: 'Actualizado', body: 'PUT desde la app', userId: 1 })}>
            PUT
          </IonButton>
          <IonButton size="small" color="danger" fill="outline" onClick={() => unico.del('/posts/1')}>
            DELETE
          </IonButton>
          {unico.cargando && <IonSpinner />}
          {unico.datos && (
            <pre data-test="respuesta" style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
              {JSON.stringify(unico.datos, null, 2)}
            </pre>
          )}
          {unico.error && <IonNote color="danger"><p>{unico.error}</p></IonNote>}
        </IonCardContent>
      </IonCard>
    </>
  );
}
