import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { MEDICOS, PACIENTES_INICIALES, VISITAS_INICIALES } from '../data/seed';
import {
  CLAVE_PACIENTES,
  CLAVE_SESION,
  CLAVE_VISITAS,
  borrar,
  guardar,
  leer,
} from '../storage';
import type { EstadoVisita, Paciente, Sesion, Visita } from '../types';

interface Contexto {
  medico: Sesion | null;
  visitas: Visita[];
  pacientes: Paciente[];
  entrar: (usuario: string, password: string) => boolean;
  salir: () => void;
  cambiarEstado: (id: string, estado: EstadoVisita) => void;
}

const ClinicaContext = createContext<Contexto | null>(null);

export function ClinicaProvider({ children }: { children: ReactNode }) {
  const [medico, setMedico] = useState<Sesion | null>(() =>
    leer<Sesion | null>(CLAVE_SESION, null)
  );
  const [visitas, setVisitas] = useState<Visita[]>(() =>
    leer<Visita[]>(CLAVE_VISITAS, VISITAS_INICIALES)
  );
  const [pacientes] = useState<Paciente[]>(() =>
    leer<Paciente[]>(CLAVE_PACIENTES, PACIENTES_INICIALES)
  );

  useEffect(() => guardar(CLAVE_VISITAS, visitas), [visitas]);
  useEffect(() => guardar(CLAVE_PACIENTES, pacientes), [pacientes]);

  const entrar = (usuario: string, password: string) => {
    const encontrado = MEDICOS.find(
      (m) => m.usuario === usuario.trim() && m.password === password
    );
    if (!encontrado) return false;
    const sesion: Sesion = {
      usuario: encontrado.usuario,
      nombre: encontrado.nombre,
      especialidad: encontrado.especialidad,
    };
    guardar(CLAVE_SESION, sesion);
    setMedico(sesion);
    return true;
  };

  const salir = () => {
    borrar(CLAVE_SESION);
    setMedico(null);
  };

  const cambiarEstado = (id: string, estado: EstadoVisita) =>
    setVisitas((previas) =>
      previas.map((v) => (v.id === id ? { ...v, estado } : v))
    );

  return (
    <ClinicaContext.Provider
      value={{ medico, visitas, pacientes, entrar, salir, cambiarEstado }}
    >
      {children}
    </ClinicaContext.Provider>
  );
}

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
