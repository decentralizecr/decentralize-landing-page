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

## Próximo paso — Fase 3
1. Scaffold del proyecto Astro v6 (`npm create astro@latest`) con output `static`, Tailwind v4, TypeScript
2. Portar el hero aprobado como componente Astro (`src/components/Hero.astro`)
3. Crear la estructura de secciones del landing:
   - Hero (portado del prototipo)
   - Problema / Agitación
   - Solución / Bitcoin Masterclass
   - Módulos del curso (5 módulos, 7+ horas)
   - Sobre Alberto (pérdida $100K, 9 000+ hs, +200 personas)
   - Testimonios (screenshots testi-1 a testi-6)
   - Calculadora DCA (CoinGecko + TradingView modal)
   - Precio / CTA ($97, $147 tachado, garantía 7 días)
   - Formulario (2 caminos: pago / llamada)
   - Footer + links legales
4. Lint + typecheck + pruebas unitarias en verde antes de cerrar cada sección

## Pendientes / decisiones para Fase 3
- Confirmar si el VSL tendrá video real o sigue como placeholder al arrancar
- Definir si las secciones se construyen de arriba hacia abajo o se priorizan las de conversión primero (formulario / precio)
