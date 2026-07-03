import { describe, it, expect } from 'vitest';
import { btcHistorico, cagrRecomendado, calcularDCA } from '../../src/lib/dca';

describe('btcHistorico', () => {
  it('arranca en 2013 y llega hasta 2025 con los valores oficiales embebidos', () => {
    expect(btcHistorico[2013]).toBe(758);
    expect(btcHistorico[2025]).toBe(87500);
    // 13 años de histórico: 2013..2025 inclusive
    expect(Object.keys(btcHistorico).length).toBe(13);
  });
});

describe('cagrRecomendado', () => {
  // Fijamos el año para que los tests sean deterministas (hoy = 2026).
  const YEAR = 2026;

  it('ancla el CAGR al año (actual - plazo) del histórico', () => {
    // plazo 5 en 2026 -> ancla 2021 = 46306
    const precio = 100000;
    const esperado = Math.max(0, Math.round((Math.pow(precio / 46306, 1 / 5) - 1) * 100));
    const r = cagrRecomendado(5, precio, YEAR);
    expect(r.pct).toBe(esperado);
    expect(r.nEfectivo).toBe(5);
    expect(r.capped).toBe(false);
  });

  it('cambia el CAGR recomendado según el plazo (3, 5, 10 distintos)', () => {
    const precio = 100000;
    const p3 = cagrRecomendado(3, precio, YEAR).pct;
    const p5 = cagrRecomendado(5, precio, YEAR).pct;
    const p10 = cagrRecomendado(10, precio, YEAR).pct;
    expect(p3).not.toBe(p5);
    expect(p5).not.toBe(p10);
  });

  it('tope: plazo > 13 (antes de 2013) usa el máximo histórico y marca capped', () => {
    const precio = 100000;
    const r = cagrRecomendado(20, precio, YEAR);
    expect(r.nEfectivo).toBe(13); // 2026 - 2013
    expect(r.capped).toBe(true);
    // Igual que anclar a 2013 con 13 años
    const esperado = Math.max(0, Math.round((Math.pow(precio / 758, 1 / 13) - 1) * 100));
    expect(r.pct).toBe(esperado);
  });

  it('plazo mínimo de 1 año aunque entre 0 o negativo', () => {
    const r = cagrRecomendado(0, 100000, YEAR);
    expect(r.nEfectivo).toBe(1); // ancla 2025
  });

  it('nunca devuelve un CAGR negativo (piso en 0)', () => {
    // precio actual por debajo del ancla -> CAGR real negativo, se recorta a 0
    const r = cagrRecomendado(1, 1000, YEAR); // ancla 2025 = 87500
    expect(r.pct).toBe(0);
  });
});

describe('calcularDCA', () => {
  it('total invertido = inicial + mensual * meses', () => {
    const r = calcularDCA({ inicial: 1000, mensual: 100, plazoAnios: 2, cagrPct: 0, precioActual: 50000 });
    expect(r.totalInvertido).toBe(1000 + 100 * 24);
  });

  it('con CAGR 0 el valor final iguala al total invertido (sin ganancia)', () => {
    const r = calcularDCA({ inicial: 1000, mensual: 100, plazoAnios: 2, cagrPct: 0, precioActual: 50000 });
    expect(r.valorFinal).toBeCloseTo(r.totalInvertido, 6);
    expect(r.ganancia).toBeCloseTo(0, 6);
  });

  it('capitaliza mensualmente: la inicial crece todo el período y cada mes suma el aporte', () => {
    const inicial = 1000, mensual = 100, plazoAnios = 1, cagrPct = 12;
    const r = calcularDCA({ inicial, mensual, plazoAnios, cagrPct, precioActual: 50000 });
    const tasa = Math.pow(1 + cagrPct / 100, 1 / 12) - 1;
    let balance = inicial;
    for (let m = 0; m < 12; m++) balance = balance * (1 + tasa) + mensual;
    expect(r.valorFinal).toBeCloseTo(balance, 6);
    expect(r.ganancia).toBeCloseTo(balance - (inicial + mensual * 12), 6);
  });

  it('precio futuro de 1 BTC = precioActual * (1 + CAGR)^plazo', () => {
    const r = calcularDCA({ inicial: 0, mensual: 100, plazoAnios: 5, cagrPct: 30, precioActual: 60000 });
    expect(r.precioFuturoBtc).toBeCloseTo(60000 * Math.pow(1.3, 5), 4);
  });

  it('BTC acumulado = total invertido / precio actual', () => {
    const r = calcularDCA({ inicial: 6000, mensual: 0, plazoAnios: 1, cagrPct: 10, precioActual: 60000 });
    expect(r.btcAcumulado).toBeCloseTo(6000 / 60000, 8);
  });

  it('no rompe si el precio actual es 0 (btcAcumulado = 0)', () => {
    const r = calcularDCA({ inicial: 1000, mensual: 0, plazoAnios: 1, cagrPct: 10, precioActual: 0 });
    expect(r.btcAcumulado).toBe(0);
    expect(Number.isFinite(r.valorFinal)).toBe(true);
  });
});
