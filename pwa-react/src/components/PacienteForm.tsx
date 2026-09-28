import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Paciente } from '../types';

interface Props {
  onGuardar: (paciente: Paciente) => void;
  paciente?: Paciente;
  onCancelar: () => void;
  existeCC: (cc: string) => boolean;
}

type Errores = Partial<Record<'nombre' | 'apellido' | 'cc', string>>;

const SOLO_LETRAS = /^[\p{L}][\p{L} ]*[\p{L}]$/u;
const SOLO_DIGITOS = /^\d{6,12}$/;

function PacienteForm({ onGuardar, existeCC, paciente, onCancelar }: Props) {
  const [nombre, setNombre] = useState(paciente?.nombre ?? '');
  const [apellido, setApellido] = useState(paciente?.apellido ?? '');
  const [cc, setCC] = useState(paciente?.cc ?? '');
  const [telefono, setTelefono] = useState(paciente?.telefono ?? '');
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

    onGuardar({
      id: paciente?.id ?? crypto.randomUUID(),
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
      <h2>{paciente ? 'Editar paciente' : 'Agregar paciente'}</h2>

      <div className="campo">
        <label htmlFor="nombre">Nombre</label>
        <input
          id="nombre"
          type="text"
          value={nombre}
          placeholder="Nombre"
          aria-label="Nombre"
          onChange={(e) => setNombre(e.target.value)}
        />
        {errores.nombre && <span className="error">{errores.nombre}</span>}
      </div>

      <div className="campo">
        <label htmlFor="apellido">Apellido</label>
        <input
          id="apellido"
          type="text"
          value={apellido}
          placeholder="Apellido"
          aria-label="Apellido"
          onChange={(e) => setApellido(e.target.value)}
        />
        {errores.apellido && <span className="error">{errores.apellido}</span>}
      </div>

      <div className="campo">
        <label htmlFor="cc">CC</label>
        <input
          id="cc"
          type="text"
          value={cc}
          placeholder="CC"
          aria-label="CC"
          onChange={(e) => setCC(e.target.value)}
        />
        {errores.cc && <span className="error">{errores.cc}</span>}
      </div>

      <div className="campo">
        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          type="tel"
          value={telefono}
          placeholder="Teléfono"
          aria-label="Teléfono"
          onChange={(e) => setTelefono(e.target.value)}
        />
      </div>

      <button type="submit">{paciente ? 'Guardar cambios' : 'Guardar'}</button>
      {paciente && <button type="button" className="secundario" onClick={onCancelar}>Cancelar edición</button>}
    </form>
  );
}

export default PacienteForm;
