import { IonChip } from '@ionic/react';
import { useRed } from '../contexts/RedContext';

export default function EstadoRed() {
  const { conectado, tipo } = useRed();
  const detalle = conectado && tipo && tipo !== 'unknown' ? ` · ${tipo}` : '';
  return (
    <IonChip color={conectado ? 'success' : 'danger'} data-testid="estado-red" aria-live="polite">
      {conectado ? 'En línea' : 'Sin conexión'}
      {detalle}
    </IonChip>
  );
}
