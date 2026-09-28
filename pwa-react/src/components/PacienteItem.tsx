import type { Paciente } from '../types';

interface Props {
  paciente: Paciente;
  onEliminar: (id: string) => void;
  onEditar: (paciente: Paciente) => void;
}

function PacienteItem({ paciente, onEliminar, onEditar }: Props) {
  return (
    <li className="item">
      <div>
        <strong>
          {paciente.nombre} {paciente.apellido}
        </strong>
        <span className="meta">
          CC {paciente.cc} &middot; Tel {paciente.telefono || 'sin registrar'}
        </span>
      </div>
      <div className="acciones">
        <button className="secundario" onClick={() => onEditar(paciente)}>
          Editar
        </button>
        <button className="borrar" onClick={() => onEliminar(paciente.id)}>
          Eliminar
        </button>
      </div>
    </li>
  );
}

export default PacienteItem;
