# Blueprint — Decentralize Landing Page (rediseño premium)

> Documento de arquitectura y plan de la Fase 1 (Planeamiento).
> El backend NO se toca. Construimos un frontend nuevo que se conecta idéntico a la infraestructura existente.

## 1. Objetivo

Reconstruir desde cero el landing de Decentralize (educación en Bitcoin, Costa Rica y LatAm) con un diseño premium de clase mundial, que convierta visitantes en leads y compradores del Bitcoin Masterclass ($97) y haga crecer la comunidad de Discord. Misma infraestructura, mismo flujo de datos, diseño infinitamente superior.

## 2. Stack

| Capa | Decisión | Por qué |
|------|----------|---------|
| Framework | Astro (v6) | Genera HTML estático, ideal para Cloudflare Pages. Islands solo donde hay interactividad: cero JS por defecto en el resto. |
| Estilos | Tailwind CSS v4 (plugin de Vite) + design tokens propios | Velocidad de iteración + sistema de diseño consistente. Tokens en CSS variables para la paleta premium. |
| Interactividad | TypeScript vanilla en islands (sin SPA framework) | Mantiene el bundle mínimo. No metemos React salvo que una pieza lo justifique. |
| Animación | GSAP + ScrollTrigger, Lenis (smooth scroll), tilt 3D por pointer | Scroll cinematográfico, parallax, reveals, contadores. Cargados solo donde se usan y respetando prefers-reduced-motion. |
| Build/Deploy | `astro build` → `dist/` → Cloudflare Pages (auto-deploy on push) | Estático puro, sin SSR ni adapter. |
| Testing | Vitest (unit) + Playwright (E2E) | Pirámide: muchas unit rápidas, pocas E2E de flujos críticos. |
| Output | `output: 'static'` | Todo el dinamismo es client-side (fetch al Worker, CoinGecko, etc.). No hace falta servidor. |

**NO usar:** React/Vue/Svelte como framework base, Redux, MUI, styled-components, bibliotecas de UI pesadas (Bootstrap), jQuery, ni el guion largo (—) en el copy.

## 3. Datos e integraciones externas (el "API surface")

No hay base de datos propia. El frontend solo consume servicios externos:

| Integración | Uso | Notas |
|-------------|-----|-------|
| Cloudflare Worker | POST del formulario | `https://decentralize-form.decentralizecr.workers.dev`. CORS solo desde `https://decentralizecr.com`. En local: mock del fetch. |
| CoinGecko (pública) | Precio BTC en vivo | `api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`. Sin llave. |
| TradingView (widget) | Gráfica BTCUSD | Script cargado SOLO al abrir el modal por primera vez. |
| Calendly | Agendar llamada | `calendly.com/decentralizecr/30min`. Escuchar `calendly.event_scheduled`. |
| Meta Pixel | Tracking | ID `871601738724161`. Todos los eventos del Brief. |

### 3.1 Contrato del formulario (sagrado, idéntico al actual)

```js
fetch('https://decentralize-form.decentralizecr.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    nombre, email, telefono, pais,
    conocimiento,   // número 0-10
    comoSeEntero,   // Instagram / Facebook / TikTok / Referido
    opcion          // 'pago' o 'llamada' EXACTO, minúsculas
  })
})
```

Esto se encapsula en una función pura `buildFormPayload(input)` con test unitario que verifica nombres de campos y los valores exactos de `opcion`. Si esto se rompe, se rompe Google Sheets y Resend.

### 3.2 Calculadora DCA (lógica)

`btcHistorico` embebido (2013-2025). Tasa mensual = `(1 + CAGR/100)^(1/12) - 1`. Inversión inicial crece todo el período; cada mes se suma el aporte y el balance crece a la tasa mensual. Total invertido = inicial + (mensual × meses). BTC acumulado = total invertido / precio actual (CoinGecko). Función pura `calcularDCA(input)` con tests unitarios. Disclaimer educativo obligatorio.

## 4. Mapa de eventos del Pixel

**Landing:** PageView, ViewContent, Lead (CTAs Calendly/menú), InitiateCheckout (CTA precio), Contact (Instagram DM), ScrollDepth*, VideoVisible*, TestimonioVisto*, FAQAbierto*, DiscordToggleAbierto*, CalculadoraOpen* / CalculadoraCalculo* / CalculadoraResult*.

**Formulario:** PageView, Lead, ViewContent, FormStart*, FormComplete*, OpcionPago* / OpcionLlamada*, Purchase (value 97, USD), Schedule (al confirmar Calendly), FormAbandono*, CalendlyVisto*.

(* = evento custom `trackCustom`.) Se encapsula en un wrapper tipado `track(evento, params)` que verifica `window.fbq` antes de disparar. Un solo punto de control, testeable.

## 5. Secciones del landing (orden)

1. Header / Nav (desktop + hamburguesa móvil, botón "Empezá ahora")
2. Hero (headline inflación/Bitcoin, VSL YouTube embebido, CTAs, stats con contadores: +9,000 horas / 7 horas / 1 solo pago)
3. Dolor ("¿Esto suena como vos?")
4. Transformación ("Imaginá esto en 5 años")
5. Módulos (Bitcoin Masterclass, 5 módulos)
6. Comunidad / Discord (imagen Servidor.png, canales colapsables, beneficios)
7. Alberto (bio, alberto.png, historia: $100K, +9,000 horas, +200 personas, CTA Calendly)
8. Testimonios (carrusel testi-1 a testi-6, solo screenshots, sin cifras de ROI)
9. Precio ("Tomá la decisión", $147 tachado → $97, garantía 7 días, badges SUGEF/Kribatta)
10. Comparativa ("¿Por qué no aprender solo?")
11. FAQ (acordeón)
12. Redes
13. Footer (legal, contacto, disclaimer)
14. Botón flotante Calculadora + modal
15. Página `form` (noindex) con dos caminos (pago / llamada), Calendly, pantalla de éxito (scrollTo top siempre)
16. Legales: privacidad, terminos, reembolso (indexables, contenido reproducido del repo viejo con diseño mejorado)

## 6. Estructura de carpetas (propuesta)

```
/
├─ public/
│  └─ assets/images/        # copiados del proyecto viejo (logo, alberto, Servidor, testi-1..6, og-image, favicons)
├─ src/
│  ├─ layouts/              # BaseLayout (head, meta, og, Pixel base)
│  ├─ pages/                # index.astro, form.astro, privacidad.astro, terminos.astro, reembolso.astro
│  ├─ components/           # secciones (Hero, Dolor, Modulos, Comunidad, Precio, FAQ, Footer, Calculadora, etc.)
│  ├─ lib/                  # form-payload.ts, dca.ts, pixel.ts, validation.ts  (lógica pura, testeada)
│  ├─ scripts/              # islands TS: animaciones (gsap), calculadora, form, calendly
│  └─ styles/               # global.css (tokens + tailwind), tipografía
├─ tests/                   # unit (vitest) + e2e (playwright)
├─ astro.config.mjs
├─ CLAUDE.md
└─ blueprint.md
```

## 7. Orden de build (milestones)

| # | Milestone | Fase del framework |
|---|-----------|--------------------|
| M0 | Scaffold Astro + Tailwind + Vitest + Playwright, copiar assets, BaseLayout, tokens base | 3 |
| M1 | Lógica pura testeable (TDD): `buildFormPayload`, `calcularDCA`, `track`, validación | 3/4 |
| M2 | Aplicar sistema de diseño aprobado (paleta, tipografía, fondo vivo, materiales) | 2→3 |
| M3 | Shell: Header/Nav, Footer, smooth scroll, sistema de fondo animado | 3 |
| M4 | Hero (VSL, contadores, CTAs) | 3 |
| M5 | Dolor + Transformación | 3 |
| M6 | Módulos (5) | 3 |
| M7 | Comunidad/Discord (canales colapsables) + Alberto | 3 |
| M8 | Testimonios + Precio + Comparativa + FAQ + Redes | 3 |
| M9 | Página form: dos caminos, Calendly, pantalla de éxito | 3 |
| M10 | Calculadora modal (CoinGecko, TradingView lazy, DCA UI) | 3 |
| M11 | Cablear todos los eventos del Pixel | 3 |
| M12 | Páginas legales (privacidad, terminos, reembolso) | 3 |
| M13 | SEO/meta/og, sitemap, robots, noindex en form, pase de performance | 3/5 |
| R | Revisión: seguridad, code-review, performance, SEO, accesibilidad | 5 |
| D | Deploy: preview → producción al confirmar, smoke test | 6 |

## 8. Performance (no negociable)

HTML estático, JS diferido y por island, IntersectionObserver para revelar y contar, TradingView solo al abrir el modal, imágenes en formato moderno (webp ya disponibles) con lazy loading y dimensiones explícitas para evitar CLS, `prefers-reduced-motion` respetado. Prioridad declarada por el cliente: máximo impacto visual sin que la página se sienta plana, pero móvil debe ir fluido.

## 9. Restricciones de marca y copy

Voseo costarricense en todo el landing. Prohibido el guion largo (—). Tono educativo, firme, anti-hype, sin promesas de enriquecimiento. Referencias locales naturales (colones, SINPE, SUGEF, Kribatta). Fondo oscuro obligatorio; paleta libre priorizando lo más premium y diferente a los crypto landings genéricos.

## 10. Riesgos y notas

- CORS del Worker: el POST real solo funciona desde producción/preview. En local se mockea.
- og-image: se mantiene el actual; no condicionar el diseño a él (el cliente lo adapta después).
- Datos oficiales que mandan sobre cualquier doc fuente: precio $97 (antes $147), garantía 7 días, Alberto perdió $100K, testimonios sin cifras de ROI.
- Definición de "terminado": lint + typecheck + pruebas (unit y E2E de flujos críticos) en verde.
