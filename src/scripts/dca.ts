export interface DCAInput {
  inicial: number;
  mensual: number;
  anios: number;
  cagr: number;
  precioBtc: number;
}

export interface DCAResult {
  totalInvertido: number;
  valorEstimado: number;
  ganancia: number;
  precioBtcEstimado: number;
  btcAcumulado: number;
}

/**
 * DCA compuesto mensual (ver spec 5.6).
 * Tasa mensual = (1 + CAGR/100)^(1/12) - 1. Cada mes suma la inversion mensual
 * y el balance crece a la tasa mensual; la inicial crece todo el periodo.
 * BTC acumulado estimado = total invertido / precio actual de BTC.
 */
export function calcularDCA({ inicial, mensual, anios, cagr, precioBtc }: DCAInput): DCAResult {
  const meses = anios * 12;
  const tasaMensual = Math.pow(1 + cagr / 100, 1 / 12) - 1;

  let balance = inicial;
  for (let m = 0; m < meses; m++) {
    balance = balance * (1 + tasaMensual) + mensual;
  }

  const totalInvertido = inicial + mensual * meses;
  const valorEstimado = balance;
  const ganancia = valorEstimado - totalInvertido;
  const precioBtcEstimado = precioBtc * Math.pow(1 + cagr / 100, anios);
  const btcAcumulado = precioBtc > 0 ? totalInvertido / precioBtc : 0;

  return { totalInvertido, valorEstimado, ganancia, precioBtcEstimado, btcAcumulado };
}
