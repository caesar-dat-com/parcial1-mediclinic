export interface Paciente {
  id: string;
  nombre: string;
  apellido: string;
  cc: string;
  telefono: string;
}

export interface Usuario {
  usuario: string;
  password: string;
  nombre: string;
}

export type Sesion = Omit<Usuario, 'password'>;
