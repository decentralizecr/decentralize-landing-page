import { describe, it, expect, vi, beforeEach } from 'vitest';
import { track } from '../src/scripts/pixel';

describe('track', () => {
  beforeEach(() => {
    (globalThis as any).fbq = vi.fn();
  });

  it('evento estandar usa "track"', () => {
    track('Purchase', { value: 97, currency: 'USD' });
    expect((globalThis as any).fbq).toHaveBeenCalledWith('track', 'Purchase', { value: 97, currency: 'USD' });
  });

  it('evento custom usa "trackCustom"', () => {
    track('FormStart', undefined, true);
    expect((globalThis as any).fbq).toHaveBeenCalledWith('trackCustom', 'FormStart', undefined);
  });

  it('no rompe si fbq no existe', () => {
    delete (globalThis as any).fbq;
    expect(() => track('PageView')).not.toThrow();
  });
});
