import { useState } from 'react';
import type { FormEvent } from 'react';
import { USUARIOS } from '../data/usuarios';
import type { Usuario } from '../types';

interface Props {
  onLogin: (usuario: Usuario) => void;
}

function Login({ onLogin }: Props) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const enviar = (e: FormEvent) => {
    e.preventDefault();
    const encontrado = USUARIOS.find(
      (u) => u.usuario === usuario.trim() && u.password === password
    );
    if (!encontrado) {
      setError('Usuario o contraseña incorrectos');
      return;
    }
    setError('');
    onLogin(encontrado);
  };

  return (
    <div className="login">
      <form className="tarjeta" onSubmit={enviar}>
        <h1>MediClinic</h1>
        <p className="sub">Administración de pacientes</p>

        <label htmlFor="usuario">Usuario</label>
        <input
          id="usuario"
          type="text"
          value={usuario}
          placeholder="admin@mediclinic.com"
          onChange={(e) => setUsuario(e.target.value)}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}

export default Login;
