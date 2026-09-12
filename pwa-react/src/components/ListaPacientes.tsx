import type { Paciente } from '../types';
import PacienteItem from './PacienteItem';

interface Props {
  pacientes: Paciente[];
  onEliminar: (id: string) => void;
}

function ListaPacientes({ pacientes, onEliminar }: Props) {
  if (pacientes.length === 0) {
    return <p className="vacio">No hay pacientes que coincidan.</p>;
  }

  return (
    <ul className="lista">
      {pacientes.map((p) => (
        <PacienteItem key={p.id} paciente={p} onEliminar={onEliminar} />
      ))}
    </ul>
  );
}

export default ListaPacientes;
