const CLAVE_SESION = 'mediclinic_sesion';
const CLAVE_PACIENTES = 'mediclinic_pacientes';

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

export { CLAVE_SESION, CLAVE_PACIENTES };
