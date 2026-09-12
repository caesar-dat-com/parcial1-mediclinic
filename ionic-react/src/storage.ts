export const CLAVE_SESION = 'mediclinic_medico';
export const CLAVE_VISITAS = 'mediclinic_visitas';
export const CLAVE_PACIENTES = 'mediclinic_pacientes_app';

export function leer<T>(clave: string, porDefecto: T): T {
  const crudo = localStorage.getItem(clave);
  if (!crudo) return porDefecto;
  try {
    return JSON.parse(crudo) as T;
  } catch {
    return porDefecto;
  }
}

export function guardar(clave: string, valor: unknown): void {
  localStorage.setItem(clave, JSON.stringify(valor));
}

export function borrar(clave: string): void {
  localStorage.removeItem(clave);
}
