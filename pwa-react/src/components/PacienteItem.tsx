import type { Paciente } from '../types';

interface Props {
  paciente: Paciente;
  onEliminar: (id: string) => void;
}

function PacienteItem({ paciente, onEliminar }: Props) {
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
      <button className="borrar" onClick={() => onEliminar(paciente.id)}>
        Eliminar
      </button>
    </li>
  );
}

export default PacienteItem;
