import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Paciente } from '../types';

interface Props {
  onAgregar: (paciente: Paciente) => void;
  existeCC: (cc: string) => boolean;
}

type Errores = Partial<Record<'nombre' | 'apellido' | 'cc', string>>;

const SOLO_LETRAS = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]{2,}$/;
const SOLO_DIGITOS = /^\d{6,12}$/;

function PacienteForm({ onAgregar, existeCC }: Props) {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [cc, setCC] = useState('');
  const [telefono, setTelefono] = useState('');
  const [errores, setErrores] = useState<Errores>({});

  const validar = (): Errores => {
    const e: Errores = {};
    if (!SOLO_LETRAS.test(nombre.trim())) {
      e.nombre = 'Mínimo 2 letras, sin números';
    }
    if (!SOLO_LETRAS.test(apellido.trim())) {
      e.apellido = 'Mínimo 2 letras, sin números';
    }
    if (!SOLO_DIGITOS.test(cc.trim())) {
      e.cc = 'La CC debe tener entre 6 y 12 dígitos';
    } else if (existeCC(cc.trim())) {
      e.cc = 'Ya existe un paciente con esa CC';
    }
    return e;
  };

  const enviar = (ev: FormEvent) => {
    ev.preventDefault();
    const e = validar();
    setErrores(e);
    if (Object.keys(e).length > 0) return;

    onAgregar({
      id: crypto.randomUUID(),
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      cc: cc.trim(),
      telefono: telefono.trim(),
    });

    setNombre('');
    setApellido('');
    setCC('');
    setTelefono('');
    setErrores({});
  };

  return (
    <form className="formulario" onSubmit={enviar}>
      <h2>Agregar paciente</h2>

      <div className="campo">
        <input
          type="text"
          value={nombre}
          placeholder="Nombre"
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && <span className="error">{errores.nombre}</span>}
      </div>

      <div className="campo">
        <input
          type="text"
          value={apellido}
          placeholder="Apellido"
          onChange={(e) => setApellido(e.target.value)}
        />
        {errores.apellido && <span className="error">{errores.apellido}</span>}
      </div>

      <div className="campo">
        <input
          type="text"
          value={cc}
          placeholder="CC"
          onChange={(e) => setCC(e.target.value)}
        />
        {errores.cc && <span className="error">{errores.cc}</span>}
      </div>

      <div className="campo">
        <input
          type="tel"
          value={telefono}
          placeholder="Teléfono"
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
}

export default PacienteForm;
