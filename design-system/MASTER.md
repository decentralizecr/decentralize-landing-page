# Design System - Decentralize Landing (MASTER)

> Fase 2 (Diseño) · Dirección elegida: **B · Editorial Depth** (ref: Stripe, páginas de
> producto de Apple). Modo oscuro fijo. Fuente de verdad para la Fase 3.
> Spec funcional: `docs/superpowers/specs/2026-06-04-decentralize-landing-design.md`.

## 0. Principios

- Premium "keynote": tipografía grande y editorial, profundidad por capas, parallax marcado,
  cards con tilt 3D sutil, transiciones de sección cinematográficas.
- Calma y autoridad sobre hype. La animación expresa causa-efecto, nunca es decorativa sola.
- Un solo acento: naranja Bitcoin. Prohibido morado/rosa tipo IA (anti-patrón).
- Rendimiento primero: todas las mitigaciones de §6 son obligatorias.

## 1. Color tokens (dark)

| Token | Valor | Uso |
|---|---|---|
| `--bg-deep` | `#050506` | Fondo más profundo (base del degradado) |
| `--bg-base` | `#0a0a0a` | Base de marca |
| `--bg-elevated` | `#111113` | Superficies/cards sólidas |
| `--surface-glass` | `rgba(255,255,255,0.04)` | Cards glass (con blur) |
| `--border-hairline` | `rgba(255,255,255,0.08)` | Bordes finos |
| `--fg` | `#F8FAFC` | Texto principal (>=15:1 sobre base) |
| `--fg-muted` | `#9BA1AC` | Texto secundario (>=4.5:1 sobre base) |
| `--bitcoin` | `#F7931A` | Acento único / CTAs |
| `--bitcoin-hi` | `#FFB347` | Highlight del gradiente/mesh |
| `--bitcoin-glow` | `rgba(247,147,26,0.18)` | Glow tras CTAs y elementos clave |
| `--success` | `#34D399` | Punto de precio vivo, ganancia DCA positiva |
| `--danger` | `#F87171` | Errores de formulario |

**Gradiente base de página:** vertical `#0a0a0a` → `#050506`.
**Mesh de acento:** washes radiales naranja (`--bitcoin` → `--bitcoin-hi`) opacity 0.10-0.16,
muy difuminados, detrás de Hero y Precio.

### Nota de accesibilidad (DECISIÓN PENDIENTE del usuario)
Texto blanco sobre botón naranja = **~2.3:1** (falla WCAG AA, mínimo 4.5:1).
La marca pide texto blanco. Opciones:
- **(a) Mantener blanco** (marca) y mitigar: label bold + tamaño >=16px, forma de botón clara.
- **(b) Texto oscuro `#0a0a0a` sobre naranja = ~9:1** (cumple AAA), cambia levemente la marca.
Por defecto se implementa (a) hasta que el usuario confirme. Resto de pares de color cumplen AA.

## 2. Tipografía

- **Display/Títulos:** Space Grotesk 600-700, tracking -2%.
- **Cuerpo:** Inter 400/500, base 16px, line-height 1.6, medida 60-75 car.
- **Datos/números:** JetBrains Mono 500 (precios, stats, BTC, eyebrows), figuras tabulares.
- `font-display: swap`. Preload solo Space Grotesk 700 + Inter 400 (críticos del hero).

**Escala (clamp, fluida):**
| Rol | Tamaño |
|---|---|
| Hero display | `clamp(2.5rem, 6vw, 5rem)` Space Grotesk 700 |
| H2 sección | `clamp(2rem, 4vw, 3.25rem)` Space Grotesk 600 |
| H3 | `clamp(1.25rem, 2vw, 1.75rem)` |
| Body | `1rem` (16px), large `1.125rem` |
| Eyebrow/label | `0.8125rem` mono, uppercase, tracking +6% |
| Stat número | `clamp(2rem, 4vw, 3rem)` mono |

## 3. Espaciado, radio, elevación

- Sistema 4/8. Ritmo vertical de sección: desktop 96-160px, móvil 64-96px.
- Gutters: móvil 20px, desktop hasta 48px (adaptan por breakpoint).
- Container `max-w-6xl` (1152px) centrado.
- Radio: cards 16-20px, botones 12px (primario puede ser pill), inputs 12px.
- Sombras (escala consistente):
  - card: `0 20px 60px rgba(0,0,0,0.5)`
  - elevated/modal: `0 30px 80px rgba(0,0,0,0.6)`
  - glow CTA: `0 0 40px rgba(247,147,26,0.25)`

## 4. Efectos (Editorial Depth)

- **Glass:** `backdrop-filter: blur(20px)` + `--surface-glass` + `--border-hairline` +
  highlight superior `inset 0 1px 0 rgba(255,255,255,0.06)`. Usar en nav (al hacer scroll),
  modal de calculadora, cards destacadas. Blur reducido a 10px en móvil.
- **Mesh naranja:** radial-gradients difuminados detrás de Hero y Precio (estático en móvil).
- **Tilt 3D:** perspective ~900px, rotación máx 6-8deg en cards de Módulos y Testimonios.
  Desactivado en touch y `prefers-reduced-motion`.
- **Breakpoints:** 375 / 768 / 1024 / 1440.

## 5. Sistema de animación

- **Easing tokens:** entrada `cubic-bezier(0.16,1,0.3,1)` (expo-out); salida
  `cubic-bezier(0.4,0,1,1)`. Salidas ~60-70% de la duración de entrada.
- **Duraciones:** micro 150-250ms; reveals de sección 600-800ms.
- **Lenis:** smooth scroll (lerp ~0.1). Sincronizado con `ScrollTrigger.update`.
- **Reveals:** `opacity 0→1`, `y 40→0`, stagger 50ms por item (`[data-reveal]`).
- **Parallax:** capas con `data-speed` (fondo/mesh más lento que el contenido). Solo `transform`.
- **Pin (1 sección):** Módulos con `ScrollTrigger.pin` revelando los 5 módulos en secuencia.
  En `<768px` o reduced-motion: degradar a reveals apilados simples (sin pin).
- **Microinteracciones:** botón press `scale(0.97)` + intensificar glow; card hover lift +
  tilt; FAQ height suave; nav glass aparece al scrollear; punto de precio vivo pulsa.
- **Reglas duras:** solo `transform`/`opacity`; `will-change` con moderación; siempre
  respetar `prefers-reduced-motion` (desactiva parallax/tilt/pin, deja fades simples).

## 6. Rendimiento (mitigación del riesgo de la Dirección B - OBLIGATORIO)

- Tilt 3D y pin SOLO en desktop (`pointer: fine` y `>=1024px`).
- `backdrop-filter` blur 20px desktop / 10px móvil; limitar número de capas con blur.
- Mesh de acento estático en móvil (sin animación de blobs).
- Todo lazy bajo el fold; VSL con fachada; GSAP/ScrollTrigger init diferido tras `load`.
- Imágenes WebP (ya disponibles) + `width/height` para CLS < 0.1.
- Presupuesto: LCP < 2.5s móvil, Lighthouse Performance >= 90, INP bajo.

## 7. Componentes clave

- **Botón primario:** fondo `--bitcoin`, texto blanco (ver §1 nota), radio 12px/pill, glow,
  press scale, `touch-action: manipulation`, min-height 44px.
- **Botón secundario:** transparente, borde hairline, texto `--fg`, hover surface.
- **Card:** `--bg-elevated` o glass, radio 16-20px, borde hairline, sombra card, hover lift+tilt.
- **Nav:** transparente arriba; al scrollear se vuelve glass con borde inferior hairline.
  Móvil: hamburguesa + botón "Empezá Ya". Estado activo marcado.
- **Inputs (form):** label visible, radio 12px, foco con ring naranja 3px, validación on-blur,
  tipos semánticos (email/tel/number), error bajo el campo en `--danger` con `role="alert"`.
- **Slider conocimiento (0-10):** track con fill naranja, valor en mono, touch >=44px.
- **FAB calculadora:** inferior derecha, glass + glow naranja, icono SVG (no emoji en producción).
- **Badges de confianza (Precio):** pago seguro, Kribatta/SUGEF, acceso de por vida, comunidad CR.

## 8. Estructura de conversión (de landing pattern Trust & Authority + social proof)

Hero (credibilidad) → Dolor (problema) → Transformación + Módulos (solución) → Comunidad →
Alberto (autoridad) → **Testimonios (prueba social ANTES del CTA)** → Precio (badges +
precio transparente $97/$147 + garantía 7 días) → Comparativa → FAQ → Redes → Footer.
CTA primario above-fold en Hero + sticky/repetido tras prueba social. Form de baja fricción.

## 9. Voz y copy

- Voseo costarricense. PROHIBIDO el guion largo (—). Sin hype ni promesas de ganancias.
- Aplicar `writing-guidelines` al redactar titulares/subtítulos/CTAs en Fase 3.
- Iconos: SVG (Lucide/Heroicons) en producción, no emoji como icono estructural.

## 10. Accesibilidad (checklist Fase 3)

- Contraste texto >=4.5:1 (resuelto salvo botón naranja, §1). Focus rings visibles 3px.
- Touch targets >=44px, spacing >=8px. Navegación por teclado, orden lógico.
- `prefers-reduced-motion` respetado. `alt` en imágenes con significado. Color nunca único canal.
