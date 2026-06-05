import { describe, it, expect } from 'vitest';
import { buildPayload } from '../src/scripts/form';

describe('buildPayload', () => {
  const base = {
    nombre: 'Ana',
    email: 'a@b.co',
    telefono: '888',
    pais: 'CR',
    conocimiento: 5,
    comoSeEntero: 'Instagram',
  };

  it('opcion pago en minusculas exactas', () => {
    expect(buildPayload({ ...base, opcion: 'pago' }).opcion).toBe('pago');
  });

  it('opcion llamada en minusculas exactas', () => {
    expect(buildPayload({ ...base, opcion: 'llamada' }).opcion).toBe('llamada');
  });

  it('mantiene exactamente los 7 campos', () => {
    const p = buildPayload({ ...base, opcion: 'pago' });
    expect(Object.keys(p).sort()).toEqual([
      'comoSeEntero', 'conocimiento', 'email', 'nombre', 'opcion', 'pais', 'telefono',
    ]);
    expect(p.conocimiento).toBe(5);
  });

  it('rechaza opcion invalida', () => {
    // @ts-expect-error opcion invalida a proposito
    expect(() => buildPayload({ ...base, opcion: 'Pago' })).toThrow();
  });
});
