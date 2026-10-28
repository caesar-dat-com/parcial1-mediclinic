import { IonContent, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import FormularioCuenta from '../components/FormularioCuenta';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const { entrar, error, limpiarError, usandoFirebase } = useAuth();
  const navegar = useNavigate();

  async function iniciarSesion(email, password) {
    const listo = await entrar(email, password);
    if (listo) navegar('/tasks', { replace: true });
  }

  return (
    <IonPage>
      <IonContent>
        <main className="contenido login">
          <div className="intro">
            <h1>Vuelve a tus pendientes</h1>
            <p>Entra con tu cuenta de Firebase para ver tu lista de tareas.</p>
          </div>
          <FormularioCuenta
            textoBoton="Ingresar"
            placeholderPassword="Tu contraseña"
            error={error}
            onEnviar={iniciarSesion}
          />
          <p className="resumen">
            ¿Todavía no tienes cuenta?{' '}
            <button
              type="button"
              className="enlace"
              onClick={() => {
                limpiarError();
                navegar('/register');
              }}
            >
              Crear una cuenta
            </button>
          </p>
          <p className="nota" data-testid="modo-firebase">
            {usandoFirebase ? 'Conectado a Firebase' : 'Modo local (sin claves de Firebase)'}
          </p>
        </main>
      </IonContent>
    </IonPage>
  );
}
