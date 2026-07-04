# PROGRESS — Decentralize Landing

> RETOMANDO: leé PROGRESS.md y después CLAUDE.md. Cargá `.claude/rules/framework.md` solo si necesitás el detalle de las fases.
> No avances de fase sin confirmación del cliente.

## Dónde vamos
- Fase del framework: **Fase 3 — Desarrollo** (landing armado; entrando a QA final y cutover)
- Milestone: landing completo + formulario + calculadora + pixel + SEO integrados y en verde
- Verificación al último guardado: astro check 0 errores, Vitest 31/31, build 6 páginas OK

## Landing (13 secciones) — COMPLETADO ✓
Hero (Globe.GL + nav + stats), Problema, Historia (Alberto), Transformación, Módulos, Recibís (link Kribatta), Discord, Testimonios (testi-1 a 6), Precio ($147→$97, garantía 15 días), Garantía (force field), FAQ, CTA Final, Footer. Voseo, fondo oscuro, sin guion largo.

## Bloques aprobados esta sesión — COMPLETADO ✓
- **Formulario /empezar** punta a punta: shell glass sobre el globo, validación requerida + restricción de tipo, "¿cómo te enteraste?" con iconos de marca (Referido con nombre embebido en `comoSeEntero`), dos caminos pago/llamada, envío real con mock local, pantallas de éxito (logo BTC + check), error, y camino llamada con Calendly embebido + confirmación (widget se mantiene visible). CTAs a /empezar desde Precio y FAQ.
- **Legales:** privacidad, términos, reembolso y **compra-venta** con `LegalLayout` compartido, fondo estrellas/cometas, glass translúcido, copy corregido (15 días unificado, sin JotForm, sin guion largo, fecha julio 2026). Copy de la Política de Compra y Venta montado en `compra-venta.astro`, fundamentado en el análisis de la Ley 10961 (reforma a Ley 7786, art. 15 quater / PSAV): indexable, Kribatta hipervinculado, voseo, sin guion largo.
- **Footer/nav:** sin "Llamada gratis 30 min", agregado "Compra y Venta" en Legal, links de Curso `/#seccion` funcionando desde todas las páginas.
- **Calculadora Bitcoin:** precio en vivo CoinGecko, chart TradingView D/S/M/1A (1A = velas anuales "12M"), CAGR dinámico por plazo con tope a 2013 (editable), resultados 2x2 centrados, FAB flotante siempre visible (PC alineado al CTA, móvil pill en dos líneas), inputs sin spinners con placeholder 0.
- **Meta Pixel** (871601738724161): helper central `pixel.ts` con DEV guard, base solo en producción, advanced matching. Eventos de landing (ScrollDepth, SectionView, ViewContent, Video*, CTAClick, ClickEmpezar, FAQOpen, Contact), calculadora (CalculadoraOpen/Calculo/Result/Close, ChartTimeframe) y form (FormStart, FormFieldComplete, OpcionSeleccionada, InitiateCheckout, Lead, Purchase, CalendlyVisto, Schedule, FormError, FormAbandono en beforeunload).
- **SEO:** meta + canonical + OG/Twitter por página, og-image 1200x630, sitemap.xml (sin /empezar), robots.txt (bloquea /empezar), JSON-LD Organization + Course, favicon de marca (favicon1.png), redes unificadas (perfil www en footer/JSON-LD, ig.me/m en contacto).
- **VSL del héroe:** YouTube (8qDk17XCfOs) con facade de carga diferida (nada de YouTube hasta el play), label "MIRÁ ESTOS 6 MIN...".

## Pendientes
1. **VALIDACIÓN LEGAL de /compra-venta** por abogado costarricense colegiado ANTES de publicar (el copy es un insumo fundamentado, no asesoría legal; requiere visto bueno profesional).
2. **Formalizar la alianza con Kribatta por escrito** (carta/convenio que confirme que Kribatta ejecuta el 100% de las operaciones).
3. **Cutover a producción** (decentralizecr.com) + verificación del Pixel en prod (Meta Pixel Helper + Test Events) + validación de share-cards (Facebook Sharing Debugger).
4. **QA final móvil** (PageSpeed).
