import { describe, it, expect } from 'vitest';
import { buildFormPayload } from '../../src/lib/form-payload';

const base = {
  nombre: 'María Fernández',
  email: 'maria@correo.com',
  codigo: '+506',
  numero: '88888888',
  pais: 'Costa Rica',
  conocimiento: 7,
  comoSeEntero: 'Instagram',
  referido: '',
  opcion: 'pago',
};

describe('buildFormPayload', () => {
  it('devuelve exactamente las 7 keys del contrato, sin agregar ni quitar', () => {
    const payload = buildFormPayload(base);
    expect(Object.keys(payload).sort()).toEqual(
      ['comoSeEntero', 'conocimiento', 'email', 'nombre', 'opcion', 'pais', 'telefono'],
    );
  });

  it('conocimiento sale como número aunque entre como string', () => {
    const payload = buildFormPayload({ ...base, conocimiento: '4' });
    expect(payload.conocimiento).toBe(4);
    expect(typeof payload.conocimiento).toBe('number');
  });

  it('telefono combina prefijo y número en un solo string', () => {
    const payload = buildFormPayload({ ...base, codigo: '+506', numero: '88888888' });
    expect(payload.telefono).toBe('+506 88888888');
  });

  it('recorta espacios sobrantes del nombre, email y número', () => {
    const payload = buildFormPayload({
      ...base,
      nombre: '  María  ',
      email: '  maria@correo.com ',
      numero: '  88888888  ',
    });
    expect(payload.nombre).toBe('María');
    expect(payload.email).toBe('maria@correo.com');
    expect(payload.telefono).toBe('+506 88888888');
  });

  it('cuando es Referido con nombre, comoSeEntero queda como "Referido: <nombre>"', () => {
    const payload = buildFormPayload({
      ...base,
      comoSeEntero: 'Referido',
      referido: 'Juan Pérez',
    });
    expect(payload.comoSeEntero).toBe('Referido: Juan Pérez');
  });

  it('cuando es Referido sin nombre, comoSeEntero queda como "Referido"', () => {
    const payload = buildFormPayload({
      ...base,
      comoSeEntero: 'Referido',
      referido: '   ',
    });
    expect(payload.comoSeEntero).toBe('Referido');
  });

  it('para orígenes que no son Referido, comoSeEntero pasa tal cual', () => {
    expect(buildFormPayload({ ...base, comoSeEntero: 'Facebook' }).comoSeEntero).toBe('Facebook');
    expect(buildFormPayload({ ...base, comoSeEntero: 'TikTok' }).comoSeEntero).toBe('TikTok');
  });

  it('opcion siempre sale en minúscula', () => {
    expect(buildFormPayload({ ...base, opcion: 'PAGO' }).opcion).toBe('pago');
    expect(buildFormPayload({ ...base, opcion: 'Llamada' }).opcion).toBe('llamada');
  });
});
