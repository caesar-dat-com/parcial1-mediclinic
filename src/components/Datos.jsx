import { IonItem, IonLabel, IonList, IonListHeader, IonNote, IonText } from '@ionic/react';

export function ListaDatos({ titulo, datos, testid }) {
  const entradas = Object.entries(datos || {}).filter(([, valor]) => valor !== undefined);
  if (!entradas.length) return null;
  return (
    <IonList className="datos" data-testid={testid}>
      {titulo && <IonListHeader>{titulo}</IonListHeader>}
      {entradas.map(([clave, valor]) => (
        <IonItem key={clave}>
          <IonLabel>
            <h3>{clave}</h3>
            <p data-testid={`dato-${clave}`}>{valor === null || valor === '' ? '—' : String(valor)}</p>
          </IonLabel>
        </IonItem>
      ))}
    </IonList>
  );
}

export function Aviso({ texto, tono = 'medium', testid }) {
  if (!texto) return null;
  const esError = tono === 'danger';
  return (
    <IonText color={tono}>
      <p
        className={esError ? 'error' : 'aviso'}
        role={esError ? 'alert' : 'status'}
        data-testid={testid}
      >
        {texto}
      </p>
    </IonText>
  );
}

export function Vacio({ texto }) {
  return <IonNote className="vacio">{texto}</IonNote>;
}
