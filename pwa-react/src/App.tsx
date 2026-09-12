import { useState } from 'react';
import Login from './components/Login';
import Pacientes from './components/Pacientes';
import { CLAVE_SESION, borrar, guardar, leer } from './storage';
import type { Sesion, Usuario } from './types';
import './index.css';

function App() {
  const [sesion, setSesion] = useState<Sesion | null>(() =>
    leer<Sesion | null>(CLAVE_SESION, null)
  );

  const entrar = (usuario: Usuario) => {
    const datos: Sesion = { usuario: usuario.usuario, nombre: usuario.nombre };
    guardar(CLAVE_SESION, datos);
    setSesion(datos);
  };

  const salir = () => {
    borrar(CLAVE_SESION);
    setSesion(null);
  };

  if (!sesion) return <Login onLogin={entrar} />;

  return (
    <div className="app">
      <header>
        <div>
          <h1>MediClinic</h1>
          <span className="meta">Sesión: {sesion.nombre}</span>
        </div>
        <button className="salir" onClick={salir}>
          Cerrar sesión
        </button>
      </header>
      <main>
        <Pacientes />
      </main>
    </div>
  );
}

export default App;
