# PROGRESS — Decentralize Landing

> RETOMANDO: leé PROGRESS.md y después CLAUDE.md. Cargá `.claude/rules/framework.md` solo si necesitás el detalle de las fases.
> No avances de fase sin confirmación del cliente.

## Dónde vamos
- Fase: **Fase 3 — Desarrollo** (cutover completado; entrando a optimización de rendimiento)
- Milestone: Lote 4 FABLE_REVIEW.md — rendimiento móvil
- Verificación al último guardado: astro check 0 errores, Vitest 31/31, build 6 páginas OK

## COMPLETADO ✓
- Landing 13 secciones: Hero (Globe.GL), Problema, Historia, Transformación, Módulos, Recibís (Kribatta), Discord, Testimonios (testi-1 a 6), Precio ($147→$97, 15 días), Garantía, FAQ, CTA Final, Footer.
- Formulario /empezar: glass sobre globo, validación, dos caminos pago/llamada, Calendly embebido, pantallas éxito/error. CTAs desde Precio y FAQ.
- Legales: privacidad, términos, reembolso, compra-venta — LegalLayout, fondo estrellas, glass, copy unificado (15 días, sin guion largo, jul 2026, Kribatta hipervinculado, Ley 10961).
- Calculadora: precio vivo CoinGecko, chart TradingView (D/S/M/1A), CAGR dinámico, FAB flotante.
- Meta Pixel (871601738724161): pixel.ts con DEV guard, advanced matching; eventos landing + calculadora + form completos.
- SEO: meta/canonical/OG por página, og-image 1200×630, sitemap.xml, robots.txt, JSON-LD Organization+Course, favicon.
- VSL héroe: YouTube (8qDk17XCfOs) con facade de carga diferida.
- **Cutover a producción (jul 6 2026):** dominio decentralizecr.com (apex + www) movido a decentralize-landing-page en Cloudflare Pages. Verificado: form funciona en ambos dominios, lead cae en Google Sheet, correos Resend con "15 días" y logo correcto, camino llamada+Calendly OK, Pixel dispara eventos reales, share-cards correctos (og:title, og:description, og:image).
- **Worker (decentralize-form, fuera del repo):** CORS apex+www, garantía 15 días, logo, validación de inputs, escape anti-inyección, manejo de errores desacoplado (Resend no tumba el éxito), token Google validado y cacheado, guiones largos corregidos.

## BASELINE DE RENDIMIENTO (PageSpeed, jul 6 2026, pre-optimización)
- Móvil: Performance 26, Accesibilidad 100, Best Practices 100, SEO 100. LCP 10.5s, TBT 6460ms, FCP 6.4s, Speed Index 12.7s, CLS 0.
- Desktop: Performance 56, Accesibilidad 100, Best Practices 100, SEO 100. LCP 1.3s, TBT 1580ms, FCP 0.8s, CLS 0.009.
- Causas identificadas (FABLE_REVIEW.md): 169 elementos animados sin pausar (B-02), scripts CDN sin defer (B-05), sin headers de caché (B-12), imágenes sin optimizar (B-06/B-07), 8396 KiB payload total.
- Objetivo Lote 4: reducir LCP y TBT en móvil sin tocar diseño.

## Pendientes
1. **Lote 4 FABLE_REVIEW.md** — rendimiento móvil (en curso).
2. **Lotes 5-7 FABLE_REVIEW.md** — tracking/calidad, accesibilidad, estructural (después del Lote 4).
3. **Medir PageSpeed** al cerrar el Lote 4 y comparar contra esta baseline.
4. **Validación legal de /compra-venta** por abogado costarricense colegiado.
5. **Formalizar alianza con Kribatta** por escrito (carta/convenio).
