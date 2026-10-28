import { IonBadge, IonNote } from '@ionic/react';

// Muestra el estado de disponibilidad que calculó el custom hook.
// No habla con ningún plugin: solo pinta lo que le pasan.
export default function EstadoSoporte({ soporte }) {
  if (!soporte) return null;
  return (
    <section className="soporte" data-testid="estado-soporte" aria-label="Disponibilidad del sensor">
      <IonBadge color={soporte.color} data-testid="nivel-soporte">
        {soporte.etiqueta}
      </IonBadge>
      <IonNote className="detalle-soporte">
        plataforma: <strong data-testid="plataforma">{soporte.plataforma}</strong> · plugin{' '}
        <code>{soporte.plugin}</code> {soporte.registrado ? 'registrado' : 'sin implementación aquí'}
      </IonNote>
      {soporte.nota && <p className="nota-soporte">{soporte.nota}</p>}
    </section>
  );
}
