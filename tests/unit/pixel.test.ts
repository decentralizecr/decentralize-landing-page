import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  PIXEL_ID,
  fbqMethodFor,
  normalizeUserData,
  track,
  trackOnce,
  setUserData,
  __setLocalOverride,
  __resetTrackOnce,
} from '../../src/lib/pixel';

describe('pixel: constantes y helpers puros', () => {
  it('expone el PIXEL_ID oficial', () => {
    expect(PIXEL_ID).toBe('871601738724161');
  });

  it('fbqMethodFor: standard=true usa "track", standard=false usa "trackCustom"', () => {
    expect(fbqMethodFor(true)).toBe('track');
    expect(fbqMethodFor(false)).toBe('trackCustom');
  });

  it('normalizeUserData: recorta y pasa a minúscula el email, deja solo dígitos el teléfono', () => {
    const am = normalizeUserData({
      email: '  Maria@Correo.com ',
      phone: '+506 8888-8888',
      firstName: '  María ',
      lastName: ' Fernández ',
    });
    expect(am).toEqual({ em: 'maria@correo.com', ph: '50688888888', fn: 'maría', ln: 'fernández' });
  });

  it('normalizeUserData: omite las claves ausentes', () => {
    expect(normalizeUserData({ email: 'a@b.com' })).toEqual({ em: 'a@b.com' });
    expect(normalizeUserData({})).toEqual({});
  });
});

describe('pixel: modo local (por defecto en test) va por console.log y NO llama fbq', () => {
  let logSpy: ReturnType<typeof vi.spyOn>;
  const fbqSpy = vi.fn();

  beforeEach(() => {
    __resetTrackOnce();
    __setLocalOverride(true);
    (globalThis as unknown as { fbq: typeof fbqSpy }).fbq = fbqSpy;
    fbqSpy.mockClear();
    logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
  });
  afterEach(() => {
    logSpy.mockRestore();
    __setLocalOverride(null);
    delete (globalThis as unknown as { fbq?: unknown }).fbq;
  });

  it('track en local hace console.log("[PIXEL]", nombre, params) y no dispara fbq', () => {
    track('CTAClick', { cta_label: 'Empezar' });
    expect(logSpy).toHaveBeenCalledWith('[PIXEL]', 'CTAClick', { cta_label: 'Empezar' });
    expect(fbqSpy).not.toHaveBeenCalled();
  });

  it('setUserData en local hace console.log y no re-inicializa el pixel', () => {
    setUserData({ email: 'A@B.com' });
    expect(fbqSpy).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
  });

  it('trackOnce dispara una sola vez por key y devuelve true/false', () => {
    expect(trackOnce('sd-25', 'ScrollDepth', { percent: 25 })).toBe(true);
    expect(trackOnce('sd-25', 'ScrollDepth', { percent: 25 })).toBe(false);
    expect(logSpy).toHaveBeenCalledTimes(1);
  });
});

describe('pixel: modo producción enruta a fbq con el método correcto', () => {
  const fbqSpy = vi.fn();

  beforeEach(() => {
    __resetTrackOnce();
    __setLocalOverride(false);
    (globalThis as unknown as { fbq: typeof fbqSpy }).fbq = fbqSpy;
    fbqSpy.mockClear();
  });
  afterEach(() => {
    __setLocalOverride(null);
    delete (globalThis as unknown as { fbq?: unknown }).fbq;
  });

  it('evento estándar → fbq("track", ...)', () => {
    track('Purchase', { value: 97, currency: 'USD' }, { standard: true });
    expect(fbqSpy).toHaveBeenCalledWith('track', 'Purchase', { value: 97, currency: 'USD' });
  });

  it('evento custom → fbq("trackCustom", ...)', () => {
    track('CalculadoraOpen');
    expect(fbqSpy).toHaveBeenCalledWith('trackCustom', 'CalculadoraOpen', {});
  });

  it('setUserData → fbq("init", PIXEL_ID, advancedMatching)', () => {
    setUserData({ email: 'A@B.com', phone: '+506 8888 8888' });
    expect(fbqSpy).toHaveBeenCalledWith('init', PIXEL_ID, { em: 'a@b.com', ph: '50688888888' });
  });

  it('no lanza si fbq no existe', () => {
    delete (globalThis as unknown as { fbq?: unknown }).fbq;
    expect(() => track('Contact', { channel: 'instagram' }, { standard: true })).not.toThrow();
  });
});
