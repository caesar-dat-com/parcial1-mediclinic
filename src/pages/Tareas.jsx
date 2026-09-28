import { useEffect, useState } from 'react';
import { IonButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import TareaForm from '../components/TareaForm';
import ListaTareas from '../components/ListaTareas';

const CLAVE = 'challenge04_tareas';
function leerTareas() {
  try {
    const datos = JSON.parse(localStorage.getItem(CLAVE) ?? '[]');
    return Array.isArray(datos) ? datos.filter((t) => t && typeof t.id === 'string' && typeof t.titulo === 'string' && typeof t.completa === 'boolean') : [];
  } catch { return []; }
}

export default function Tareas({ onSalir }) {
  const [tareas, setTareas] = useState(leerTareas);
  useEffect(() => { localStorage.setItem(CLAVE, JSON.stringify(tareas)); }, [tareas]);
  const pendientes = tareas.filter((t) => !t.completa).length;
  const agregar = (titulo) => setTareas((previas) => [...previas, { id: crypto.randomUUID(), titulo, completa: false }]);
  const cambiar = (id) => setTareas((previas) => previas.map((t) => t.id === id ? { ...t, completa: !t.completa } : t));
  const eliminar = (id) => setTareas((previas) => previas.filter((t) => t.id !== id));

  return <IonPage>
    <IonHeader><IonToolbar><IonTitle>Mis tareas</IonTitle>
      {onSalir && <IonButtons slot="end"><IonButton onClick={onSalir}>Cerrar sesión</IonButton></IonButtons>}
    </IonToolbar></IonHeader>
    <IonContent><main className="contenido">
      <div className="intro"><h1>Una cosa a la vez</h1><p>Anota lo que tienes pendiente y márcalo cuando termines.</p></div>
      <TareaForm onAgregar={agregar} />
      <p className="resumen" aria-live="polite">Pendientes: {pendientes} de {tareas.length}</p>
      <ListaTareas tareas={tareas} onCambiar={cambiar} onEliminar={eliminar} />
    </main></IonContent>
  </IonPage>;
}
