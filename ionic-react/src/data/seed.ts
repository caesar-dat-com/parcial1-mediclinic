import type { Medico, Paciente, Visita } from '../types';

export const MEDICOS: Medico[] = [
  { usuario: 'medico@mediclinic.com', password: '123', nombre: 'Dra. Laura Mejía', especialidad: 'Medicina interna' },
  { usuario: 'cesar@mediclinic.com', password: 'uao2026', nombre: 'Dr. César Reyes', especialidad: 'Medicina general' },
];

export const VISITAS_INICIALES: Visita[] = [
  { id: 'v1', paciente: 'Ana Gómez', hora: '08:00', direccion: 'Cra 45 #12-30', motivo: 'Control de presión', estado: 'pendiente' },
  { id: 'v2', paciente: 'Luis Torres', hora: '09:30', direccion: 'Calle 9 #80-14', motivo: 'Curación post-operatoria', estado: 'en_camino' },
  { id: 'v3', paciente: 'Marta Ruiz', hora: '11:00', direccion: 'Av 6N #23-11', motivo: 'Toma de muestras', estado: 'pendiente' },
  { id: 'v4', paciente: 'Jorge Salazar', hora: '14:15', direccion: 'Cra 100 #16-40', motivo: 'Valoración geriátrica', estado: 'finalizada' },
];

export const PACIENTES_INICIALES: Paciente[] = [
  { id: 'p1', nombre: 'Ana', apellido: 'Gómez', cc: '1005944430', telefono: '3155551212' },
  { id: 'p2', nombre: 'Luis', apellido: 'Torres', cc: '94123456', telefono: '3009876543' },
  { id: 'p3', nombre: 'Marta', apellido: 'Ruiz', cc: '31567890', telefono: '3181234567' },
  { id: 'p4', nombre: 'Jorge', apellido: 'Salazar', cc: '16234567', telefono: '3124455667' },
];
