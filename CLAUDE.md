# CLAUDE.md — Decentralize Landing Page

Frontend premium nuevo para Decentralize (educación en Bitcoin, Costa Rica / LatAm).
Vende el Bitcoin Masterclass ($97) y hace crecer la comunidad de Discord vía un formulario de leads.
El backend YA existe y NO se toca: solo nos conectamos a él idéntico al sitio actual.

## Stack (declarado)

- Astro (v6), output `static`.
- Tailwind CSS v4 (plugin de Vite) + design tokens en CSS variables.
- TypeScript. Islands con TS vanilla (sin SPA framework).
- Animación: GSAP + ScrollTrigger, Lenis (smooth scroll), tilt 3D por pointer.
- Tests: Vitest (unit) + Playwright (E2E).
- Deploy: Cloudflare Pages, auto-deploy on push (`astro build` → `dist/`).

## NO usar

- React / Vue / Svelte como framework base, ni SPA.
- Redux, MUI, styled-components, Bootstrap, jQuery.
- Bibliotecas de UI pesadas o que inflen el bundle sin aportar.
- El guion largo (—) en el copy. Nunca. Usar dos puntos, comas o puntos.
- Llaves/secretos en el frontend. El frontend no maneja ninguna API key.

## Comandos

```bash
npm run dev        # desarrollo local (http://localhost:4321)
npm run build      # build estático a dist/
npm run preview    # previsualizar el build
npm run test       # Vitest unit
npm run test:e2e   # Playwright E2E
npm run lint       # lint
npm run typecheck  # astro check / tsc
```

(Los scripts se crean en el scaffold M0; esta lista es el contrato esperado.)

## Definición de "terminado"

Una tarea está terminada solo si: lint + typecheck + pruebas (unit y E2E de flujos críticos) en verde.

## Reglas de marca y copy

- Voseo costarricense en TODO el landing (vos, tenés, aprendés).
- Prohibido el guion largo (—).
- Tono educativo, firme, anti-hype. Vendemos educación y claridad, no ganancias. Sin promesas de enriquecimiento.
- Referencias locales naturales donde aplique (colones, SINPE Móvil, SUGEF, Kribatta).
- Fondo oscuro obligatorio. Paleta libre: priorizar lo más premium y diferenciarse de los crypto landings genéricos. Naranja Bitcoin `#F7931A` disponible como acento, no obligatorio.

## Datos oficiales (mandan sobre cualquier documento fuente)

- Precio: $97, con $147 tachado.
- Garantía: 7 días.
- Alberto perdió $100K aprendiendo; +9,000 horas estudiando desde 2021; ayudó a +200 personas.
- Curso: 5 módulos, 7+ horas. Un solo pago, acceso de por vida.
- Testimonios: solo screenshots (testi-1 a testi-6). Sin cifras de ROI inventadas.

## Contrato del formulario (SAGRADO, no cambiar)

POST a `https://decentralize-form.decentralizecr.workers.dev`, `Content-Type: application/json`:

```json
{
  "nombre": "", "email": "", "telefono": "", "pais": "",
  "conocimiento": 0,
  "comoSeEntero": "",
  "opcion": "pago"
}
```

- `conocimiento`: número 0-10 (slider).
- `comoSeEntero`: Instagram / Facebook / TikTok / Referido.
- `opcion`: EXACTAMENTE `'pago'` o `'llamada'` en minúsculas. El Worker decide el correo según ese valor.
- CORS: el Worker solo acepta `https://decentralizecr.com`. En local se mockea el fetch; el POST real se prueba en preview/producción.
- Encapsular en `src/lib/form-payload.ts` (`buildFormPayload`), con test unitario.

### Dos caminos
- `opcion: 'pago'` → Worker manda correo con métodos de pago (Davivienda, BAC, USDT) y $97. Mostrar pantalla de confirmación "revisá tu correo".
- `opcion: 'llamada'` → mostrar Calendly embebido (`https://calendly.com/decentralizecr/30min`). Escuchar `calendly.event_scheduled` para la pantalla de éxito.
- La pantalla de éxito SIEMPRE carga desde el tope (`window.scrollTo(0,0)`).

## Meta Pixel (ID 871601738724161)

Encapsular en `src/lib/pixel.ts` (`track(evento, params)`), que verifica `window.fbq` antes de disparar.

- Landing: PageView, ViewContent, Lead, InitiateCheckout, Contact, y custom: ScrollDepth, VideoVisible, TestimonioVisto, FAQAbierto, DiscordToggleAbierto, CalculadoraOpen, CalculadoraCalculo, CalculadoraResult.
- Form: PageView, Lead, ViewContent, Purchase (value 97, USD), Schedule, y custom: FormStart, FormComplete, OpcionPago, OpcionLlamada, FormAbandono, CalendlyVisto.

## Calculadora

- Precio en vivo: CoinGecko (`/simple/price?ids=bitcoin&vs_currencies=usd`), sin llave, con punto verde pulsante.
- Gráfica: widget TradingView Advanced Chart, cargado SOLO al abrir el modal la primera vez (`BITSTAMP:BTCUSD`, intervalo D, theme dark, locale es).
- DCA: `src/lib/dca.ts` (`calcularDCA`), con tests. Tasa mensual = `(1 + CAGR/100)^(1/12) - 1`. Disclaimer educativo obligatorio.

## Enlaces y assets

- Worker: `https://decentralize-form.decentralizecr.workers.dev`
- Calendly: `https://calendly.com/decentralizecr/30min`
- Instagram DM: `https://ig.me/m/decentralizecr` · Kribatta: `https://web.kribatta.com/index-es.php`
- Email: `admin@decentralizecr.com`
- Redes: instagram.com/decentralizecr · tiktok.com/@decentralizecr · facebook.com/decentralizecr · x.com/decentralizecr
- Assets viejos a copiar: `C:\Users\acede\Documents\Claude\Landing Page - Decentralize\assets\images`
- `form` lleva `<meta name="robots" content="noindex">`. Las legales SÍ se indexan.

## Flujo de trabajo

Framework de 7 fases, una a la vez, sin avanzar sin confirmación del cliente. Deploy a preview primero; producción solo cuando se pide. Revisar cada archivo antes de aceptarlo. Ver `blueprint.md` para arquitectura y orden de build.
