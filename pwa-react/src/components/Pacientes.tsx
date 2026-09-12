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

  useEffect(() => {
    guardar(CLAVE_PACIENTES, pacientes);
  }, [pacientes]);

  const agregar = (p: Paciente) => setPacientes([...pacientes, p]);
  const eliminar = (id: string) =>
    setPacientes(pacientes.filter((p) => p.id !== id));
  const existeCC = (cc: string) => pacientes.some((p) => p.cc === cc);

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
      <PacienteForm onAgregar={agregar} existeCC={existeCC} />

      <section className="panel">
        <h2>
          Pacientes <span className="badge">{filtrados.length}</span>
        </h2>
        <Buscador texto={busqueda} onBuscar={setBusqueda} />
        <ListaPacientes pacientes={filtrados} onEliminar={eliminar} />
      </section>
    </div>
  );
}

export default Pacientes;
