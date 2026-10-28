import { IonContent, IonPage } from '@ionic/react';
import { useNavigate } from 'react-router-dom';
import FormularioCuenta from '../components/FormularioCuenta';
import useAuth from '../hooks/useAuth';

export default function Register() {
  const { registrar, error, limpiarError, usandoFirebase } = useAuth();
  const navegar = useNavigate();

  async function crearCuenta(email, password) {
    const listo = await registrar(email, password);
    if (listo) navegar('/tasks', { replace: true });
  }

  return (
    <IonPage>
      <IonContent>
        <main className="contenido login">
          <div className="intro">
            <h1>Crea tu cuenta</h1>
            <p>Con el correo y una contraseña de al menos 6 caracteres queda lista.</p>
          </div>
          <FormularioCuenta
            textoBoton="Registrarme"
            placeholderPassword="Mínimo 6 caracteres"
            pedirConfirmacion
            error={error}
            onEnviar={crearCuenta}
          />
          <p className="resumen">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              className="enlace"
              onClick={() => {
                limpiarError();
                navegar('/login');
              }}
            >
              Iniciar sesión
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
