# CLAUDE.md — Decentralize Landing Page

> Al iniciar la sesión, leé PROGRESS.md primero. No avances de fase sin mi confirmación.

## Project
Frontend premium para Decentralize (educación en Bitcoin, Costa Rica / LatAm). Vende Bitcoin Masterclass ($97) y genera leads para Discord. Deploy: Cloudflare Pages. El backend (Worker) ya existe y NO se toca.

## Stack declarado
- Astro v6, output `static`
- Tailwind CSS v4 (plugin de Vite) + design tokens en CSS variables
- TypeScript. Islands con TS vanilla (sin SPA framework)
- Animación: GSAP, tilt 3D por pointer
- Tests: Vitest (unit) + Playwright (E2E)
- Deploy: Cloudflare Pages, auto-deploy on push (`astro build` → `dist/`)

## Commands
```bash
npm run dev        # localhost:4321
npm run build      # build estático a dist/
npm run preview    # previsualizar build
npm run test       # Vitest unit
npm run test:e2e   # Playwright E2E
npm run lint
npm run typecheck  # astro check / tsc
```

## Never use
- React / Vue / Svelte como framework base, ni SPA
- Redux, MUI, styled-components, Bootstrap, jQuery
- Bibliotecas de UI pesadas o que inflen el bundle
- El guion largo (—) en el copy. Nunca.
- Llaves/secretos en el frontend

## Definition of done
Lint + typecheck + pruebas (unit y E2E de flujos críticos) en verde.

## Hard rules
- No pasar de fase sin confirmación del cliente
- Deploy a preview primero; producción solo al confirmar explícitamente
- Revisar cada archivo de Claude antes de aceptarlo
- El Worker del formulario NO se toca
- Sin llaves/secretos en el repo ni en el frontend

## Datos oficiales (mandan sobre cualquier fuente)
- Precio: $97, con $147 tachado. Garantía: 15 días.
- Alberto: perdió $100K; +9,000 horas estudiando desde 2021; ayudó a +200 personas.
- Curso: 5 módulos, 7+ horas. Un solo pago, acceso de por vida.
- Testimonios: solo screenshots (testi-1 a testi-6). Sin cifras de ROI.

## Contrato del formulario (SAGRADO — no cambiar)
POST `https://decentralize-form.decentralizecr.workers.dev` · `Content-Type: application/json`

```json
{ "nombre":"", "email":"", "telefono":"", "pais":"", "conocimiento":0, "comoSeEntero":"", "opcion":"pago" }
```

- `conocimiento`: número 0-10 (slider)
- `comoSeEntero`: `Instagram` / `Facebook` / `TikTok` / `Referido`
- `opcion`: EXACTAMENTE `'pago'` o `'llamada'` en minúsculas
- CORS: solo acepta `https://decentralizecr.com`. En local: mockear el fetch.
- Encapsular en `src/lib/form-payload.ts` (`buildFormPayload`) con test unitario.
- `opcion:'pago'` → correo con métodos de pago (Davivienda, BAC, USDT). Mostrar "revisá tu correo".
- `opcion:'llamada'` → Calendly `https://calendly.com/decentralizecr/30min`. Escuchar `calendly.event_scheduled`.
- Pantalla de éxito SIEMPRE desde el tope (`window.scrollTo(0,0)`).

## Meta Pixel — ID 871601738724161
Encapsular en `src/lib/pixel.ts` (`track(evento, params)`), verificar `window.fbq` antes de disparar.
- Landing: PageView, ViewContent, Contact (estándar) + custom: SectionView, ScrollDepth, VideoVisible, VideoPlay, VideoProgress, VideoComplete, CTAClick, ClickEmpezar, FAQOpen, TestimonioVisto, TestimonioAbierto, DiscordToggleAbierto, CalculadoraOpen, CalculadoraClose, CalculadoraCalculo, CalculadoraResult, ChartTimeframe.
- Form: PageView, ViewContent, InitiateCheckout, Lead, Purchase (value:97, USD), Schedule (estándar) + custom: FormStart, FormFieldComplete, OpcionSeleccionada, CalendlyVisto, FormError, FormAbandono.

## Calculadora
- Precio BTC en vivo: CoinGecko `/simple/price?ids=bitcoin&vs_currencies=usd`, sin llave, punto verde pulsante.
- TradingView Advanced Chart: cargado SOLO al abrir el modal (`BITSTAMP:BTCUSD`, intervalo D, theme dark, locale es).
- DCA: `src/lib/dca.ts` (`calcularDCA`). Tasa mensual = `(1 + CAGR/100)^(1/12) - 1`. Disclaimer educativo obligatorio.

## URLs y assets
- Worker: `https://decentralize-form.decentralizecr.workers.dev`
- Calendly: `https://calendly.com/decentralizecr/30min`
- Instagram DM: `https://ig.me/m/decentralizecr` · Kribatta: `https://web.kribatta.com/index-es.php`
- Email: `admin@decentralizecr.com`
- Redes: instagram.com/decentralizecr · tiktok.com/@decentralizecr · facebook.com/decentralizecr · x.com/decentralizecr
- Assets: `C:\Users\acede\Documents\Claude\Landing Page - Decentralize\assets\images`
- `form` lleva `<meta name="robots" content="noindex">`. Legales SÍ se indexan.

## Brand voice
- Voseo costarricense en TODO el landing (vos, tenés, aprendés).
- Prohibido el guion largo (—). Usar dos puntos, comas o puntos.
- Tono educativo, firme, anti-hype. Sin promesas de enriquecimiento ni cifras de ROI.
- Referencias locales: colones, SINPE Móvil, SUGEF, Kribatta.
- Fondo oscuro obligatorio. Naranja Bitcoin `#F7931A` como acento disponible, no obligatorio.

## Reference files — leer solo cuando sean relevantes, NO al inicio de sesión
- `.claude/rules/framework.md` → las 7 fases, cheat sheet y reglas de oro
- `blueprint.md` → arquitectura, secciones, estructura de carpetas, orden de build

## Reglas de sesión
- Cargá CLAUDE.md y PROGRESS.md cada sesión. Framework y blueprint se leen solo cuando la tarea lo requiera.
- Actualizá PROGRESS.md SOLO cuando: el cliente aprueba un bloque, dice "guardá progreso", se cierra una iteración/milestone, o se cambia de fase. Cambiás solo las secciones que de verdad cambiaron. Nunca en cada mensaje.
- Vigilá el contexto con `/context`; `/compact` al ~50–60%; `/clear` al cambiar de tarea no relacionada; subagentes para explorar sin ensuciar la ventana principal.
