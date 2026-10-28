// Componente de Contacts. Consume el custom hook useContactsFirestore y el
// estado de red; no toca Firebase directamente.
import { useState } from 'react';
import { IonButton, IonInput, IonItem, IonLabel, IonList, IonText } from '@ionic/react';
import useContactsFirestore from '../hooks/useContactsFirestore';
import { useRed } from '../contexts/RedContext';

export default function Contactos() {
  const { contactos, agregarContacto, editarContacto, eliminarContacto, origen } =
    useContactsFirestore();
  const { sinRed } = useRed();
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [editando, setEditando] = useState(null);
  const [error, setError] = useState('');

  function limpiar() {
    setNombre('');
    setTelefono('');
    setEditando(null);
    setError('');
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (sinRed) {
      setError('Sin conexión no se puede escribir en Firestore.');
      return;
    }
    if (!nombre.trim() || !telefono.trim()) {
      setError('Escribe el nombre y el teléfono.');
      return;
    }
    const datos = { nombre: nombre.trim(), telefono: telefono.trim() };
    if (editando) await editarContacto(editando, datos);
    else await agregarContacto(datos);
    limpiar();
  }

  function comenzarEdicion(contacto) {
    setEditando(contacto.id);
    setNombre(contacto.nombre ?? '');
    setTelefono(contacto.telefono ?? '');
    setError('');
  }

  return (
    <section>
      <div className="intro">
        <h1>Contacts</h1>
        <p>Guardados en Firestore. Necesitan conexión para crear, editar o borrar.</p>
      </div>

      {sinRed && (
        <IonText color="danger" className="aviso" data-testid="aviso-contacts" role="status">
          Sin conexión: las acciones de Contacts están deshabilitadas porque viven en Firestore.
        </IonText>
      )}

      <form onSubmit={enviar}>
        <IonList>
          <IonItem>
            <IonInput
              label="Nombre"
              labelPlacement="stacked"
              placeholder="Por ejemplo, Ana Lopez"
              value={nombre}
              disabled={sinRed}
              maxlength={80}
              onIonInput={(evento) => setNombre(evento.detail.value ?? '')}
            />
          </IonItem>
          <IonItem>
            <IonInput
              label="Teléfono"
              labelPlacement="stacked"
              placeholder="3001234567"
              inputmode="tel"
              value={telefono}
              disabled={sinRed}
              maxlength={30}
              onIonInput={(evento) => setTelefono(evento.detail.value ?? '')}
            />
          </IonItem>
        </IonList>
        {error && (
          <IonText color="danger" role="alert" className="error">
            {error}
          </IonText>
        )}
        <IonButton
          type="submit"
          expand="block"
          disabled={sinRed}
          data-testid="guardar-contacto"
        >
          {editando ? 'Guardar cambios' : 'Guardar contacto'}
        </IonButton>
        {editando && (
          <IonButton expand="block" fill="clear" onClick={limpiar} data-testid="cancelar-contacto">
            Cancelar edición
          </IonButton>
        )}
      </form>

      <p className="resumen" aria-live="polite" data-testid="resumen-contacts">
        Contactos: {contactos.length} · Origen: {origen}
      </p>

      {contactos.length === 0 ? (
        <div className="vacio">
          <IonText color="medium">Todavía no hay contactos. Agrega el primero arriba.</IonText>
        </div>
      ) : (
        <IonList aria-label="Lista de contactos">
          {contactos.map((contacto) => (
            <IonItem key={contacto.id}>
              <IonLabel>
                <h2>{contacto.nombre}</h2>
                <p>{contacto.telefono}</p>
              </IonLabel>
              <IonButton
                slot="end"
                size="small"
                fill="clear"
                disabled={sinRed}
                aria-label={`Editar contacto ${contacto.nombre}`}
                data-testid={`editar-contacto-${contacto.nombre}`}
                onClick={() => comenzarEdicion(contacto)}
              >
                Editar
              </IonButton>
              <IonButton
                slot="end"
                size="small"
                fill="clear"
                color="danger"
                disabled={sinRed}
                aria-label={`Eliminar contacto ${contacto.nombre}`}
                data-testid={`eliminar-contacto-${contacto.nombre}`}
                onClick={() => eliminarContacto(contacto.id)}
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
