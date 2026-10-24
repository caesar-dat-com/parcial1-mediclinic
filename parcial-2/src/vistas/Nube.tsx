import { useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonInput, IonItem, IonLabel, IonList, IonNote,
} from '@ionic/react';
import { useSupabaseTabla } from '../hooks/useSupabaseTabla';
import { useRegistrosLocales } from '../hooks/useRegistrosLocales';
import { useNetwork } from '../hooks/useNetwork';

type Nota = { id: number; titulo: string; detalle: string };

export default function Nube() {
  const { filas, insertar, eliminar, disponible, error, cargando } = useSupabaseTabla<Nota>('notas');
  const { registros, marcarSincronizado, pendientes } = useRegistrosLocales();
  const { conectado } = useNetwork();
  const [titulo, setTitulo] = useState('');

  /** Sube a Supabase lo que quedó guardado localmente mientras no había internet. */
  const sincronizar = async () => {
    for (const r of registros.filter((x) => x.sincronizado === 0)) {
      const creado = await insertar({ titulo: r.titulo, detalle: r.detalle } as Partial<Nota>);
      if (creado && r.id) await marcarSincronizado(r.id);
    }
  };

  if (!disponible) {
    return (
      <IonCard>
        <IonCardHeader><IonCardTitle>Supabase</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <p>
            Falta configurar <code>VITE_SUPABASE_URL</code> y <code>VITE_SUPABASE_KEY</code> en el
            archivo <code>.env</code>. Mientras tanto la app sigue funcionando con la base local.
          </p>
        </IonCardContent>
      </IonCard>
    );
  }

  return (
    <>
      <IonCard>
        <IonCardHeader><IonCardTitle>Notas en la nube</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <IonItem>
            <IonLabel position="stacked">Título</IonLabel>
            <IonInput value={titulo} onIonInput={(e) => setTitulo(e.detail.value ?? '')} />
          </IonItem>
          <IonButton
            onClick={async () => { if (titulo.trim()) { await insertar({ titulo } as Partial<Nota>); setTitulo(''); } }}
          >
            Guardar en Supabase
          </IonButton>
          {cargando && <IonNote>Cargando…</IonNote>}
          {error && <IonNote color="danger"><p>{error}</p></IonNote>}
          <IonList>
            {filas.map((n) => (
              <IonItem key={n.id}>
                <IonLabel>{n.titulo}</IonLabel>
                <IonButton slot="end" fill="clear" color="danger" onClick={() => eliminar(n.id)}>
                  Borrar
                </IonButton>
              </IonItem>
            ))}
          </IonList>
        </IonCardContent>
      </IonCard>

      <IonCard>
        <IonCardHeader><IonCardTitle>Sincronizar lo local</IonCardTitle></IonCardHeader>
        <IonCardContent>
          <p>{pendientes} registro(s) sin subir.</p>
          <IonButton disabled={!conectado || pendientes === 0} onClick={sincronizar}>
            Subir pendientes
          </IonButton>
        </IonCardContent>
      </IonCard>
    </>
  );
}
