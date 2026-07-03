// Helper central del Meta Pixel de Decentralize.
// TODO disparo del sitio pasa por acá: nunca se llama a fbq() suelto.
// En local (dev o localhost/127.0.0.1) NO se toca el pixel real: solo console.log.
// En producción enruta a fbq: estándar -> 'track', custom -> 'trackCustom'.
// El snippet base se inyecta en BaseLayout solo con import.meta.env.PROD.

export const PIXEL_ID = '871601738724161';

const LOCAL_HOSTS = ['localhost', '127.0.0.1'];

/** import.meta.env.DEV o hostname local. Sin acceso a window/location, cae en DEV. */
export function detectIsLocal(): boolean {
  const dev = Boolean(import.meta.env && import.meta.env.DEV);
  const host = typeof location !== 'undefined' ? location.hostname : '';
  return dev || LOCAL_HOSTS.includes(host);
}

/** Valor resuelto al cargar el módulo; útil para consumidores que quieran ramificar. */
export const isLocal = detectIsLocal();

// Semilla de tests: forzar local/prod. null = detección real.
let localOverride: boolean | null = null;
function resolveIsLocal(): boolean {
  return localOverride === null ? detectIsLocal() : localOverride;
}

type FbqMethod = 'track' | 'trackCustom';

/** Traduce el flag "standard" al método de fbq correspondiente. */
export function fbqMethodFor(standard: boolean): FbqMethod {
  return standard ? 'track' : 'trackCustom';
}

function getFbq(): ((...args: unknown[]) => void) | null {
  const f = (globalThis as unknown as { fbq?: unknown }).fbq;
  return typeof f === 'function' ? (f as (...args: unknown[]) => void) : null;
}

export interface TrackOpts {
  /** true = evento estándar de Meta (fbq 'track'); false = evento custom (fbq 'trackCustom'). */
  standard?: boolean;
}

/** Dispara un evento. En local hace console.log; en producción llama a fbq (si existe). */
export function track(
  name: string,
  params: Record<string, unknown> = {},
  opts: TrackOpts = {},
): void {
  const { standard = false } = opts;
  if (resolveIsLocal()) {
    console.log('[PIXEL]', name, params);
    return;
  }
  const fbq = getFbq();
  if (fbq) fbq(fbqMethodFor(standard), name, params);
}

const fired = new Set<string>();

/** Dispara un evento una sola vez por sesión de página (dedup por `key`). Devuelve si disparó. */
export function trackOnce(
  key: string,
  name: string,
  params: Record<string, unknown> = {},
  opts: TrackOpts = {},
): boolean {
  if (fired.has(key)) return false;
  fired.add(key);
  track(name, params, opts);
  return true;
}

export interface UserData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
}

/** Normaliza los datos para advanced matching (el pixel hashea solo). */
export function normalizeUserData(data: UserData): Record<string, string> {
  const out: Record<string, string> = {};
  if (data.email) out.em = data.email.trim().toLowerCase();
  if (data.phone) out.ph = data.phone.replace(/\D/g, '');
  if (data.firstName) out.fn = data.firstName.trim().toLowerCase();
  if (data.lastName) out.ln = data.lastName.trim().toLowerCase();
  return out;
}

/** Re-inicializa el pixel con advanced matching. En local solo console.log. */
export function setUserData(data: UserData): void {
  const am = normalizeUserData(data);
  if (resolveIsLocal()) {
    console.log('[PIXEL] setUserData', am);
    return;
  }
  const fbq = getFbq();
  if (fbq) fbq('init', PIXEL_ID, am);
}

// ── Semillas de test (no usar en runtime) ──
export function __setLocalOverride(v: boolean | null): void {
  localOverride = v;
}
export function __resetTrackOnce(): void {
  fired.clear();
}
