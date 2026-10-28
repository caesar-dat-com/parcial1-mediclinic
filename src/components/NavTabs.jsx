import { IonButton, IonButtons } from '@ionic/react';
import { useLocation, useNavigate } from 'react-router-dom';

const SECCIONES = [
  { ruta: '/contacts', titulo: 'Contacts' },
  { ruta: '/tasks', titulo: 'Tasks' },
  { ruta: '/fruits', titulo: 'Fruits' },
];

export default function NavTabs() {
  const navegar = useNavigate();
  const { pathname } = useLocation();
  return (
    <IonButtons className="navegacion" aria-label="Secciones">
      {SECCIONES.map(({ ruta, titulo }) => (
        <IonButton
          key={ruta}
          size="small"
          fill={pathname === ruta ? 'solid' : 'clear'}
          aria-current={pathname === ruta ? 'page' : undefined}
          onClick={() => navegar(ruta)}
        >
          {titulo}
        </IonButton>
      ))}
    </IonButtons>
  );
}
