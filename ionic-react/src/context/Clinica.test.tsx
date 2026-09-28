import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ClinicaProvider } from './Clinica';
import { useClinica } from './useClinica';
import { CLAVE_SESION, CLAVE_VISITAS } from '../storage';

beforeEach(() => localStorage.clear());
afterEach(cleanup);
const montar = () => renderHook(() => useClinica(), { wrapper: ClinicaProvider });

describe('sesión y visitas', () => {
  it('no crea una sesión con credenciales incorrectas', () => {
    const { result } = montar();
    act(() => { expect(result.current.entrar('medico@mediclinic.com', 'mal')).toBe(false); });
    expect(result.current.medico).toBeNull();
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });
  it('recupera la sesión y la borra al salir', () => {
    const primera = montar();
    act(() => { expect(primera.result.current.entrar('medico@mediclinic.com', '123')).toBe(true); });
    primera.unmount();
    const segunda = montar();
    expect(segunda.result.current.medico?.usuario).toBe('medico@mediclinic.com');
    act(() => segunda.result.current.salir());
    expect(segunda.result.current.medico).toBeNull();
    expect(localStorage.getItem(CLAVE_SESION)).toBeNull();
  });
  it('guarda un cambio de visita sin modificar las demás', () => {
    const { result, unmount } = montar();
    const otras = result.current.visitas.filter((v) => v.id !== 'v1');
    act(() => result.current.cambiarEstado('v1', 'en_camino'));
    expect(result.current.visitas.filter((v) => v.id !== 'v1')).toEqual(otras);
    unmount();
    expect(montar().result.current.visitas.find((v) => v.id === 'v1')?.estado).toBe('en_camino');
  });
  it('recupera los datos iniciales si el JSON está dañado', () => {
    localStorage.setItem(CLAVE_VISITAS, '{');
    expect(montar().result.current.visitas).toHaveLength(4);
  });
});
