import { createContext, useContext } from 'react';
import type { EstadoVisita, Paciente, Sesion, Visita } from '../types';

interface Contexto {
  medico: Sesion | null;
  visitas: Visita[];
  pacientes: Paciente[];
  entrar: (usuario: string, password: string) => boolean;
  salir: () => void;
  cambiarEstado: (id: string, estado: EstadoVisita) => void;
}

export const ClinicaContext = createContext<Contexto | null>(null);

export function useClinica(): Contexto {
  const ctx = useContext(ClinicaContext);
  if (!ctx) throw new Error('useClinica debe usarse dentro de ClinicaProvider');
  return ctx;
}

export const SIGUIENTE: Record<EstadoVisita, EstadoVisita | null> = {
  pendiente: 'en_camino',
  en_camino: 'finalizada',
  finalizada: null,
};

export const ETIQUETA: Record<EstadoVisita, string> = {
  pendiente: 'Pendiente',
  en_camino: 'En camino',
  finalizada: 'Finalizada',
};

export const COLOR: Record<EstadoVisita, string> = {
  pendiente: 'warning',
  en_camino: 'primary',
  finalizada: 'success',
};
