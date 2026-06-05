type Fbq = (...args: unknown[]) => void;

/**
 * Central helper sobre Meta Pixel (fbq). Eventos estandar usan 'track',
 * eventos custom usan 'trackCustom'. No-op seguro si fbq no esta cargado.
 */
export function track(event: string, params?: Record<string, unknown>, custom = false): void {
  const fbq = (globalThis as { fbq?: Fbq }).fbq;
  if (typeof fbq !== 'function') return;
  fbq(custom ? 'trackCustom' : 'track', event, params);
}
