# CLAUDE.md - Decentralize Landing Page

Frontend premium nuevo para el landing de Decentralize (educación en Bitcoin, Costa Rica).
Reconstruye SOLO el frontend conectándose EXACTO a la infraestructura backend existente,
que NO se toca. Spec completo: `docs/superpowers/specs/2026-06-04-decentralize-landing-design.md`.

## Stack (declarado)
- Astro (`output: 'static'`) + Tailwind CSS.
- GSAP + ScrollTrigger (animaciones), Lenis (smooth scroll).
- TypeScript vanilla para islands. SIN framework de UI (no React/Vue).
- Hosting: Cloudflare Pages (NO Vercel). Build `npm run build` → `dist/`.

## NO usar
El usuario pidió libertad total. Los únicos límites duros:
- Nada que rompa el build estático en Cloudflare Pages.
- Nada que degrade la velocidad móvil: sin librerías de UI pesadas (Bootstrap, MUI), sin jQuery.

## Reglas de marca y copy (obligatorias)
- Voseo costarricense (vos, tenés, aprendés).
- PROHIBIDO el guion largo (—) en el copy del sitio. Usar dos puntos, comas o puntos.
- Tono educativo, confiado, SIN hype ni promesas de enriquecimiento. "Educación antes de inversión".
- Colores: base `#0a0a0a`, acento naranja `#F7931A`, texto de botones blanco. Modo oscuro fijo.
- Precio: $97 (tachado $147). Garantía: 7 días. Testimonios SIN cifras de rendimiento.

## INTOCABLE (toca producción - reproducir exacto)
- POST al Worker `https://decentralize-form.decentralizecr.workers.dev` con los 7 campos:
  `nombre, email, telefono, pais, conocimiento (0-10), comoSeEntero, opcion`.
- `opcion` = `'pago'` o `'llamada'` EXACTO en minúsculas (el Worker decide el correo).
- Camino pago → pantalla "revisá tu correo". Camino llamada → Calendly
  (`/decentralizecr/30min`), escuchar `calendly.event_scheduled`.
- Pantalla de éxito siempre con `window.scrollTo(0,0)`.
- Meta Pixel ID `871601738724161`: mantener TODOS los eventos (landing + form, ver spec §5.5).
- Calculadora: CoinGecko (precio vivo) + TradingView (lazy, solo al abrir modal) + DCA.
- El frontend NO maneja llaves. Viven como Secrets en el Worker.

## Páginas
`/` (indexable) · `/form` (noindex) · `/privacidad` · `/terminos` · `/reembolso` (indexables).

## Rendimiento (límite duro)
- LCP < 2.5s móvil, Lighthouse Performance >= 90.
- YouTube VSL (`8qDk17XCfOs`) con fachada/lazy. TradingView + CoinGecko lazy.
- Imágenes WebP (ya en `assets/images/`). GSAP solo `transform`/`opacity`. Respetar `prefers-reduced-motion`.

## Definición de "terminado"
`astro build` sin error · `astro check` en verde · sin errores de consola · 5 páginas
existen y `/form` con noindex · presupuesto de performance cumplido · eventos de Pixel
verificables (Meta Pixel Helper) · POST real responde 200 en preview de Cloudflare.

## Flujo de trabajo
- Framework de 7 fases: Plan → Diseño → Desarrollo → Pruebas → Revisión → Deploy → Manten.
  Una fase a la vez; no avanzar sin confirmación del usuario.
- Deploy: commit → `git push` → Cloudflare Pages auto-despliega. Preview primero.
- `.env*` en `.gitignore`. Nunca subir secretos a git.
