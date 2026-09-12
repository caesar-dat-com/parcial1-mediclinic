export type EstadoVisita = 'pendiente' | 'en_camino' | 'finalizada';

export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cc: string;
  telefono: string;
}

export interface Visita {
  id: string;
  paciente: string;
  hora: string;
  direccion: string;
  motivo: string;
  estado: EstadoVisita;
}

export interface Medico {
  usuario: string;
  password: string;
  nombre: string;
  especialidad: string;
}

export type Sesion = Omit<Medico, 'password'>;
