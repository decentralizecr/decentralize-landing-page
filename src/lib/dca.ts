// Lógica pura de la Calculadora Bitcoin (DCA compuesto + CAGR histórico).
// Encapsulada acá para testearla por unidad sin tocar el DOM.
// El precio actual SIEMPRE entra como parámetro: la única fuente de verdad
// en vivo es CoinGecko, resuelta en la isla del componente.

/** Primer año con dato histórico disponible. */
export const HIST_MIN_YEAR = 2013;

/**
 * Precios de cierre anual de Bitcoin (USD), embebidos.
 * Sirven de ancla para calcular el CAGR real por plazo.
 */
export const btcHistorico: Record<number, number> = {
  2013: 758,
  2014: 320,
  2015: 430,
  2016: 963,
  2017: 14156,
  2018: 3742,
  2019: 7193,
  2020: 28990,
  2021: 46306,
  2022: 16547,
  2023: 42265,
  2024: 93429,
  2025: 87500,
};

export interface CagrRecomendado {
  /** CAGR recomendado en porcentaje entero, con piso en 0. */
  pct: number;
  /** Años realmente usados para el cálculo (tope al histórico disponible). */
  nEfectivo: number;
  /** true cuando el plazo pedido excede el histórico y se usó el máximo. */
  capped: boolean;
}

/**
 * CAGR recomendado DINÁMICO según el plazo elegido, calculado contra el
 * histórico anual con ancla en (año actual - plazo).
 *
 * El tope solo limita la RECOMENDACIÓN (ancla máxima a 2013): el plazo de la
 * proyección hacia adelante no se limita en el componente.
 *
 * @param plazoAnios  plazo en años que eligió el lead
 * @param precioActual precio BTC en vivo (CoinGecko)
 * @param currentYear año actual (inyectable para tests deterministas)
 */
export function cagrRecomendado(
  plazoAnios: number,
  precioActual: number,
  currentYear: number = new Date().getFullYear(),
): CagrRecomendado {
  const maxAnios = currentYear - HIST_MIN_YEAR;
  const pedido = Math.max(1, Math.floor(plazoAnios) || 1);
  const nEfectivo = Math.min(pedido, maxAnios);
  const anchor = btcHistorico[currentYear - nEfectivo];

  if (!anchor || !precioActual || precioActual <= 0) {
    return { pct: 0, nEfectivo, capped: pedido > maxAnios };
  }

  const cagr = Math.pow(precioActual / anchor, 1 / nEfectivo) - 1;
  return {
    pct: Math.max(0, Math.round(cagr * 100)),
    nEfectivo,
    capped: pedido > maxAnios,
  };
}

export interface DcaInput {
  /** Inversión inicial en USD. */
  inicial: number;
  /** Aporte mensual en USD. */
  mensual: number;
  /** Plazo hacia adelante, en años. */
  plazoAnios: number;
  /** Rendimiento anual estimado (CAGR) en porcentaje. */
  cagrPct: number;
  /** Precio BTC actual en vivo (CoinGecko). */
  precioActual: number;
}

export interface DcaResult {
  /** Total aportado: inicial + mensual * meses. */
  totalInvertido: number;
  /** Valor estimado de la inversión al final del plazo (capitalización mensual). */
  valorFinal: number;
  /** Ganancia estimada: valorFinal - totalInvertido. */
  ganancia: number;
  /** Precio estimado de 1 BTC al final del plazo. */
  precioFuturoBtc: number;
  /** BTC acumulado = total invertido / precio actual. */
  btcAcumulado: number;
}

/**
 * DCA con capitalización mensual compuesta.
 * Cada mes: el balance crece a la tasa mensual y luego se suma el aporte.
 * La inversión inicial capitaliza todo el período.
 */
export function calcularDCA(input: DcaInput): DcaResult {
  const { inicial, mensual, plazoAnios, cagrPct, precioActual } = input;

  const meses = Math.max(0, Math.round(plazoAnios * 12));
  const tasaMensual = Math.pow(1 + cagrPct / 100, 1 / 12) - 1;

  let balance = inicial;
  for (let m = 0; m < meses; m++) {
    balance = balance * (1 + tasaMensual) + mensual;
  }

  const totalInvertido = inicial + mensual * meses;
  const ganancia = balance - totalInvertido;
  const precioFuturoBtc = precioActual * Math.pow(1 + cagrPct / 100, plazoAnios);
  const btcAcumulado = precioActual > 0 ? totalInvertido / precioActual : 0;

  return {
    totalInvertido,
    valorFinal: balance,
    ganancia,
    precioFuturoBtc,
    btcAcumulado,
  };
}
