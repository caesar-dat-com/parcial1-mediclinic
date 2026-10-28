// Componente Frutas (el mismo nombre que usamos en clase). Consume el custom
// hook useFruitsDexie, incluida la `newFunction` que filtra y cuenta sobre la
// tabla de Dexie. No se deshabilita sin red: IndexedDB es local.
import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import useFruitsDexie from '../hooks/useFruitsDexie';
import { useRed } from '../contexts/RedContext';

export default function Frutas() {
  const {
    frutas,
    frutasFiltradas,
    filtro,
    total,
    unidades,
    newFunction,
    agregarFruta,
    editarFruta,
    eliminarFruta,
    origen,
  } = useFruitsDexie();
  const { sinRed } = useRed();
  const [nombre, setNombre] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  function limpiar() {
    setNombre('');
    setCantidad('');
    setEditando(null);
    setError('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!nombre.trim()) {
      setError('Escribe el nombre de la fruta.');
      return;
    }
    const datos = { nombre: nombre.trim(), cantidad: Number(cantidad) || 0 };
    if (editando) await editarFruta(editando, datos);
    else await agregarFruta(datos);
    limpiar();
  }

  function comenzarEdicion(fruta) {
    setEditando(fruta.id);
    setNombre(fruta.nombre ?? '');
    setCantidad(String(fruta.cantidad ?? ''));
    setError('');
  }

  return (
    <section>
      <div className="intro">
        <h1>Fruits</h1>
        <p>Guardadas con Dexie en IndexedDB. Siguen funcionando sin conexión.</p>
      </div>

      {sinRed && (
        <IonText color="success" className="aviso" data-testid="aviso-fruits" role="status">
          Sin conexión: Fruits sigue activo porque Dexie guarda en el propio dispositivo.
        </IonText>
      )}

      <form onSubmit={enviar}>
        <IonList>
          <IonItem>
            <IonInput
              label="Fruta"
              labelPlacement="stacked"
              placeholder="Por ejemplo, Mango"
              value={nombre}
              maxlength={60}
              onIonInput={(evento) => setNombre(evento.detail.value ?? '')}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Cantidad"
              labelPlacement="stacked"
              placeholder="Por ejemplo, 12"
              type="number"
              inputmode="numeric"
              min={0}
              value={cantidad}
              onIonInput={(evento) => setCantidad(evento.detail.value ?? '')}
            />
          </IonItem>
        </IonList>
        {error && (
          <IonText color="danger" role="alert" className="error">
            {error}
          </IonText>
        )}
        <IonButton type="submit" expand="block" data-testid="guardar-fruta">
          {editando ? 'Guardar cambios' : 'Guardar fruta'}
        </IonButton>
        {editando && (
          <IonButton expand="block" fill="clear" onClick={limpiar} data-testid="cancelar-fruta">
            Cancelar edición
          </IonButton>
        )}
      </form>

      {/* newFunction: búsqueda viva sobre la tabla de Dexie */}
      <IonList>
        <IonItem>
          <IonInput
            label="Buscar fruta (newFunction)"
            labelPlacement="stacked"
            placeholder="Escribe parte del nombre"
            value={filtro}
            data-testid="buscar-fruta"
            onIonInput={(evento) => newFunction(evento.detail.value ?? '')}
          />
        </IonItem>
      </IonList>

      <p className="resumen" aria-live="polite" data-testid="resumen-frutas">
        Frutas: {total} de {frutas.length} · Unidades: {unidades}
      </p>
      <p className="resumen">Origen: {origen}</p>

      {frutasFiltradas.length === 0 ? (
        <div className="vacio">
          <IonText color="medium">
            {filtro
              ? `Ninguna fruta coincide con "${filtro}".`
              : 'Todavía no hay frutas. Agrega la primera arriba.'}
          </IonText>
        </div>
      ) : (
        <IonList aria-label="Lista de frutas">
          {frutasFiltradas.map((fruta) => (
            <IonItem key={fruta.id}>
              <IonLabel>
                <h2>{fruta.nombre}</h2>
                <p>{fruta.cantidad} unidades</p>
              </IonLabel>
              <IonButton
                slot="end"
                size="small"
                fill="clear"
                aria-label={`Editar fruta ${fruta.nombre}`}
                data-testid={`editar-fruta-${fruta.nombre}`}
                onClick={() => comenzarEdicion(fruta)}
              >
                Editar
              </IonButton>
              <IonButton
                slot="end"
                size="small"
                fill="clear"
                color="danger"
                aria-label={`Eliminar fruta ${fruta.nombre}`}
                data-testid={`eliminar-fruta-${fruta.nombre}`}
                onClick={() => eliminarFruta(fruta.id)}
              >
                Eliminar
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      )}
    </section>
  );
}
