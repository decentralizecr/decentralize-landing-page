export type Opcion = 'pago' | 'llamada';

export interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  conocimiento: number; // 0-10
  comoSeEntero: string;
  opcion: Opcion;
}

/** Worker en produccion. CORS solo acepta origin https://decentralizecr.com. */
export const WORKER_URL = 'https://decentralize-form.decentralizecr.workers.dev';

/**
 * Construye el payload EXACTO que espera el Worker (7 campos). 'opcion' debe
 * ser 'pago' o 'llamada' en minusculas: el Worker decide el correo segun ese valor.
 */
export function buildPayload(d: FormData): FormData {
  if (d.opcion !== 'pago' && d.opcion !== 'llamada') {
    throw new Error(`opcion invalida: ${d.opcion}`);
  }
  return {
    nombre: d.nombre,
    email: d.email,
    telefono: d.telefono,
    pais: d.pais,
    conocimiento: d.conocimiento,
    comoSeEntero: d.comoSeEntero,
    opcion: d.opcion,
  };
}

/** POST al Worker con el payload validado. */
export async function submitForm(d: FormData): Promise<Response> {
  return fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(d)),
  });
}
