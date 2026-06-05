import { describe, it, expect } from 'vitest';
import { calcularDCA } from '../src/scripts/dca';

describe('calcularDCA', () => {
  it('sin mensual: solo crece la inicial al CAGR', () => {
    const r = calcularDCA({ inicial: 1000, mensual: 0, anios: 1, cagr: 30, precioBtc: 100000 });
    expect(r.totalInvertido).toBe(1000);
    expect(r.valorEstimado).toBeCloseTo(1300, 0);
    expect(r.ganancia).toBeCloseTo(300, 0);
    expect(r.btcAcumulado).toBeCloseTo(0.01, 5);
  });

  it('con mensual y cagr 0: total invertido = inicial + mensual*meses, sin crecimiento', () => {
    const r = calcularDCA({ inicial: 0, mensual: 100, anios: 1, cagr: 0, precioBtc: 50000 });
    expect(r.totalInvertido).toBe(1200);
    expect(r.valorEstimado).toBeCloseTo(1200, 0);
  });

  it('con mensual y cagr positivo: valor estimado supera lo invertido', () => {
    const r = calcularDCA({ inicial: 500, mensual: 50, anios: 2, cagr: 30, precioBtc: 95000 });
    expect(r.totalInvertido).toBe(500 + 50 * 24);
    expect(r.valorEstimado).toBeGreaterThan(r.totalInvertido);
  });

  it('precioBtc 0 no rompe: btcAcumulado = 0', () => {
    const r = calcularDCA({ inicial: 100, mensual: 0, anios: 1, cagr: 10, precioBtc: 0 });
    expect(r.btcAcumulado).toBe(0);
  });
});
