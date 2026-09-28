import { useEffect, useState } from 'react';
import type { Paciente } from '../types';
import { CLAVE_PACIENTES, guardar, leer } from '../storage';
import Buscador from './Buscador';
import ListaPacientes from './ListaPacientes';
import PacienteForm from './PacienteForm';

function Pacientes() {
  const [pacientes, setPacientes] = useState<Paciente[]>(() =>
    leer<Paciente[]>(CLAVE_PACIENTES, [])
  );
  const [busqueda, setBusqueda] = useState('');
  const [editando, setEditando] = useState<Paciente | undefined>();

  useEffect(() => {
    guardar(CLAVE_PACIENTES, pacientes);
  }, [pacientes]);

  const guardarPaciente = (paciente: Paciente) => {
    setPacientes((anteriores) => editando
      ? anteriores.map((p) => p.id === paciente.id ? paciente : p)
      : [...anteriores, paciente]);
    setEditando(undefined);
  };
  const eliminar = (id: string) => {
    setPacientes((anteriores) => anteriores.filter((p) => p.id !== id));
    if (editando?.id === id) setEditando(undefined);
  };
  const existeCC = (cc: string) =>
    pacientes.some((p) => p.cc === cc && p.id !== editando?.id);

  const termino = busqueda.trim().toLowerCase();
  // al hijo le paso la lista ya filtrada
  const filtrados = termino
    ? pacientes.filter(
        (p) =>
          p.nombre.toLowerCase().includes(termino) ||
          p.apellido.toLowerCase().includes(termino) ||
          p.cc.includes(termino)
      )
    : pacientes;

  return (
    <div className="pacientes">
      <PacienteForm
        key={editando?.id ?? 'nuevo'}
        paciente={editando}
        onGuardar={guardarPaciente}
        existeCC={existeCC}
        onCancelar={() => setEditando(undefined)}
      />

      <section className="panel">
        <h2>
          Pacientes <span className="badge">{filtrados.length}</span>
        </h2>
        <Buscador texto={busqueda} onBuscar={setBusqueda} />
        <ListaPacientes pacientes={filtrados} onEliminar={eliminar} onEditar={setEditando} />
      </section>
    </div>
  );
}

export default Pacientes;
