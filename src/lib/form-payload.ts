// Construcción del payload del formulario de inscripción.
// Contrato SAGRADO del Worker: exactamente estas 7 keys, sin agregar ni quitar.
// Encapsulado acá para poder testearlo por unidad sin tocar el DOM.

/** Datos crudos que salen del formulario (prefijo y número por separado). */
export interface FormInput {
  nombre: string;
  email: string;
  /** Prefijo de país, ej. '+506'. */
  codigo: string;
  /** Número local, ej. '88888888'. */
  numero: string;
  pais: string;
  /** 0-10, puede llegar como número o como string del slider. */
  conocimiento: number | string;
  /** 'Instagram' | 'Facebook' | 'TikTok' | 'Referido'. */
  comoSeEntero: string;
  /** Nombre de quien refirió (solo aplica cuando comoSeEntero === 'Referido'). */
  referido?: string;
  /** 'pago' | 'llamada' (se normaliza a minúscula). */
  opcion: string;
}

/** Payload final que se envía al Worker. */
export interface FormPayload {
  nombre: string;
  email: string;
  telefono: string;
  pais: string;
  conocimiento: number;
  comoSeEntero: string;
  opcion: string;
}

export function buildFormPayload(input: FormInput): FormPayload {
  let comoSeEntero = input.comoSeEntero;
  if (comoSeEntero === 'Referido') {
    const ref = (input.referido ?? '').trim();
    comoSeEntero = ref ? 'Referido: ' + ref : 'Referido';
  }

  return {
    nombre: input.nombre.trim(),
    email: input.email.trim(),
    telefono: (input.codigo + ' ' + input.numero.trim()).trim(),
    pais: input.pais,
    conocimiento: Number(input.conocimiento),
    comoSeEntero,
    opcion: input.opcion.toLowerCase(),
  };
}
