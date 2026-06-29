# PROGRESS — Decentralize Landing

> RETOMANDO: leé PROGRESS.md y después CLAUDE.md. Cargá `.claude/rules/framework.md` solo si necesitás el detalle de las fases.
> No avances de fase sin confirmación del cliente.

## Dónde vamos
- Fase del framework: **Fase 3 — Desarrollo** (Fase 2 cerrada y aprobada)
- Milestone: scaffold de Astro + build del landing completo con todas las secciones
- Archivo de referencia aprobado: `prototipo/hero-hibrido.html`

## Estado de la Fase 2 — CERRADA ✓
Dirección visual Híbrido A+B aprobada por el cliente. Hero listo para implementar en producción.

### Todo lo aprobado en Fase 2
- **Concepto visual global:** fondo espacio negro, estrellas pulsantes + cometas, planeta Tierra nocturno gigante (Globe.GL + Three.js), nodos Bitcoin, arcos de conexión animados, ₿ viajando por arcos
- **Botones:** liquid glass con efecto blob naranja al hover, breathing animation en CTA principal
- **Tipografía:** Space Grotesk (display) + JetBrains Mono (mono), título blanco con text-shadow negro profundo para legibilidad sobre el globo
- **Pill "Bitcoin Masterclass":** fondo `rgba(247,147,26,0.18)`, texto `#ffffff`, `font-weight: 600`, dot pulsante naranja
- **VSL placeholder:** panel 16:9 con play button glass, posicionado debajo del título; `margin-top: 1px` en móvil
- **Stats:** 3 tarjetas estilo satélite flotante con LED pulsante (9 000 hs / 7 hs de contenido / 1 solo pago)
- **CTA principal:** "Unirme al Bitcoin Masterclass", pill naranja con breathing glow
- **Nav desktop:** logo + links + botón "Empezá ahora" glass naranja
- **Nav móvil:** botón "Empezá Ya" + hamburger (☰→✕) con dropdown glass oscuro, blur 20px, borde naranja, 4 opciones
- **Paleta:** fondo `#070708`, naranja Bitcoin `#F7931A`, texto `#FFFFFF`, muted `#8892a4`
- **Modo oscuro fijo, sin framework SPA, sin dependencias pesadas**

## Historial de iteraciones del hero
- Iter 1: moneda dorada flotante con órbita de luz
- Iter 2: planeta Tierra con nodos, primera versión
- Iter 3: textura NASA real, tipografía Bodoni, liquid glass
- Iter 4: degradado acero en título, layout reorganizado
- Iter 5: planeta full-bleed, DM Serif Display, VSL flotante
- Iter 6: Outfit 800, título 3 líneas, planeta fondo completo, drag manual, satélites
- Iter 7: Space Grotesk acero frío, menos actividad y más elegante, stats satélite flotantes, luces 4x, glow naranja Bitcoin puro
- Iter 8: planeta calcado a fotos de referencia (luces ámbar en manchas, océanos oscuros), glow Fresnel naranja #F7931A propio, título plateado más luminoso, un solo CTA
- Iter 9: atmosphere celeste #87CEEB built-in (suave, difuminado), retirado el Fresnel naranja
- Iter 10 (polish final aprobado): pill opacity 0.18, texto blanco 600, VSL margin-top 1px móvil, nav móvil con "Empezá Ya" + hamburger + dropdown

## Secciones aprobadas — orden de construcción (una a la vez, sin avanzar sin confirmación)

| # | Sección | Estado | Notas |
|---|---------|--------|-------|
| 1 | Hero | ✅ Aprobado | Globe.GL + nav + stats + copy final |
| 2 | El Problema | 🔨 En construcción | Oscuro, tenso, sin planeta. Miedos + inflación/colón/bancos. |
| 3 | Mi Historia (Alberto) | Pendiente | Íntimo, glass, foto alberto.png, $100K, +9 000 horas |
| 4 | La Transformación | Pendiente | Antes/después con ❌ y ✅, caos gris a naranja al scroll |
| 5 | Módulos | Pendiente | 5 módulos, habilidades adquiridas, limpio |
| 6 | Todo lo que recibís | Pendiente | Inventario premium glass, prepara el precio |
| 7 | Comunidad Discord | Pendiente | Servidor.png + canales colapsables + beneficios |
| 8 | Testimonios | Pendiente | testi-1 a 6, sin cifras ROI, cerca del precio |
| 9 | Precio | ✅ Aprobado | Anillo Saturno denso + planeta ₿ giratorio con glow + rayos eléctricos; border beam en card y CTA, glows. Copy final: eyebrow "TU INVERSIÓN", $147→$97, ancla +$1,000, 6 incluidos (Kribatta link), garantía 15 días, badges 2x2. Verificado 7/7 (build, anclas, fps, reduced-motion, 390px, Kribatta). |
| 10 | Garantía | 🔨 Próxima | Force field shield. 15 días, limpio, escudo |
| 11 | FAQ | Pendiente | Acordeón oscuro |
| 12 | CTA Final | Pendiente | Vuelve el planeta, cierre del viaje |
| 13 | Redes + Footer | Pendiente | Cierre limpio |

## Próximos pasos inmediatos
1. Sección 10 (Garantía, force field shield): próxima a construir
2. Continuar en orden hasta cerrar el landing (FAQ, CTA final, footer)

## Pendientes / decisiones para Fase 3
- Confirmar si el VSL tendrá video real o sigue como placeholder al arrancar
