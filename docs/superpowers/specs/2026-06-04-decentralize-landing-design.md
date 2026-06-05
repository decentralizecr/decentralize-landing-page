# Decentralize - Nuevo Landing Page · Design Spec

> Fecha: 2026-06-04 · Fase 1 (Planeamiento) · Estado: aprobado
> Objetivo: reconstruir el frontend del landing de Decentralize con un diseño premium
> de clase mundial, conectándose EXACTO a la infraestructura de backend existente
> (que NO se toca).

---

## 1. Contexto y objetivo

Decentralize es una marca de educación en Bitcoin enfocada en Costa Rica y Latinoamérica.
El objetivo de negocio del landing es:

1. Vender el **Bitcoin Masterclass** (curso de **$97**, precio tachado **$147**).
2. Hacer crecer la comunidad privada de Discord.
3. Capturar leads vía formulario.

Ya existe una versión en producción (`https://www.decentralizecr.com`, espejo
`https://decentralize-landing.pages.dev`) con TODO el backend conectado y funcionando.
Este proyecto reconstruye **solo el frontend**, mucho más premium, conectándose igual
a esa infraestructura. El backend (Cloudflare Worker, Google Sheets, Resend, Calendly,
Pixel, calculadora con APIs públicas) NO se modifica.

### Objetivo de diseño (máxima prioridad)
Que se vea como un producto de clase mundial (nivel Apple / Stripe / Linear / Framer):
estética premium "new tech", animaciones al scroll (parallax, reveals suaves, capas),
profundidad y 3D sutil, glassmorphism sutil, microinteracciones pulidas, sin sacrificar
velocidad en móvil. Identidad de marca: negro profundo `#0a0a0a` base + naranja Bitcoin
`#F7931A` acento, texto de botones blanco. Modo oscuro fijo (no hay toggle claro).

---

## 2. Stack técnico

- **Astro** con `output: 'static'` (HTML/CSS estático, cero JS por defecto).
- **Tailwind CSS** con tokens de marca.
- **GSAP + ScrollTrigger** para reveals, parallax, profundidad.
- **Lenis** para smooth scroll.
- **TypeScript vanilla** para las partes interactivas (islands de Astro). Sin framework
  de UI (no React / Vue), para mantener el bundle mínimo.
- Hosting: **Cloudflare Pages** (plan gratuito). NO Vercel (el framework genérico asume
  Vercel; este proyecto se adapta a Pages).

### Guardrails (las únicas reglas duras; el usuario pidió libertad total fuera de esto)
- Nada que rompa el build estático en Cloudflare Pages.
- Nada que degrade la velocidad móvil. En la práctica: sin librerías de UI pesadas
  (Bootstrap, MUI) y sin jQuery.

---

## 3. Estructura de carpetas

```
decentralize-landing-page/
├── astro.config.mjs          # output: 'static'
├── tailwind.config.mjs        # tokens: #0a0a0a, #F7931A
├── tsconfig.json
├── CLAUDE.md
├── docs/superpowers/specs/    # este spec
├── public/
│   ├── assets/images/...      # ya copiados (logo, alberto, Servidor, testi-1..6, og-image)
│   ├── favicons/
│   └── robots.txt
└── src/
    ├── layouts/BaseLayout.astro      # <head>, meta, OG, Pixel base
    ├── pages/
    │   ├── index.astro               # landing completo
    │   ├── form.astro                # funnel (noindex)
    │   ├── privacidad.astro
    │   ├── terminos.astro
    │   └── reembolso.astro
    ├── components/
    │   ├── landing/  (Nav, Hero, Dolor, Transformacion, Modulos,
    │   │             Comunidad, Alberto, Testimonios, Precio,
    │   │             Comparativa, FAQ, Redes, Footer)
    │   ├── calculator/ (CalculatorFab + CalculatorModal)
    │   └── form/      (FormFunnel)
    └── scripts/
        ├── pixel.ts          # helper central track() sobre fbq
        ├── animations.ts     # init Lenis + ScrollTrigger
        ├── calculator.ts     # CoinGecko + TradingView + DCA
        └── form.ts           # POST al Worker + Calendly
```

---

## 4. Mapa de páginas

| Ruta | Indexable | Contenido |
|---|---|---|
| `/` | sí | Landing completo (secciones de §6, en orden) |
| `/form` | NO (`noindex`) | Funnel: datos → pago/llamada → Calendly → éxito |
| `/privacidad` | sí | Política de Privacidad |
| `/terminos` | sí | Términos y Condiciones |
| `/reembolso` | sí | Política de Reembolso |

---

## 5. Flujo de datos crítico (INTOCABLE - reproducir exacto)

### 5.1 Formulario (7 campos)
`nombre` (texto), `email`, `telefono`, `pais` (texto), `conocimiento` (número 0-10, slider),
`comoSeEntero` (Instagram / Facebook / TikTok / Referido), `opcion` (`'pago'` | `'llamada'`).

### 5.2 POST al Worker
```js
fetch('https://decentralize-form.decentralizecr.workers.dev', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ nombre, email, telefono, pais, conocimiento, comoSeEntero, opcion })
})
```
CRÍTICO: `opcion` debe ser exactamente `'pago'` o `'llamada'` en minúsculas. El Worker
decide el correo según ese valor. CORS: el Worker solo acepta origin
`https://decentralizecr.com`, por lo que el POST real se prueba en preview/producción de
Cloudflare, no en localhost.

### 5.3 Los dos caminos del funnel
- **`pago`**: el Worker manda correo con métodos de pago (Davivienda, BAC, USDT) y $97.
  Mostrar pantalla de confirmación "revisá tu correo".
- **`llamada`**: mostrar widget de Calendly embebido (`https://calendly.com/decentralizecr/30min`,
  script `https://assets.calendly.com/assets/external/widget.js`). Al mostrar la pantalla
  de llamada, hacer scroll al tope. Escuchar `calendly.event_scheduled` para mostrar éxito.

### 5.4 Pantalla de éxito
Siempre `window.scrollTo(0,0)` al mostrarla (bug recurrente de la versión vieja).

### 5.5 Meta Pixel (ID `871601738724161`) - mantener TODOS los eventos
**Landing:** PageView, ViewContent, Lead (CTAs Calendly/menú), InitiateCheckout (CTA precio),
Contact (botón IG DM), y customs: ScrollDepth, VideoVisible, TestimonioVisto, FAQAbierto,
DiscordToggleAbierto, CalculadoraOpen, CalculadoraCalculo, CalculadoraResult.
**Form:** PageView, Lead, ViewContent, y customs FormStart, FormComplete, OpcionPago,
OpcionLlamada, Purchase (value 97, USD, en `pago`), Schedule (al confirmar llamada),
FormAbandono, CalendlyVisto.

### 5.6 Calculadora de inversión Bitcoin
- FAB inferior derecho "📊 Calculadora de Inversión Bitcoin" con glow naranja → abre modal.
- Precio vivo: CoinGecko `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`,
  con punto verde pulsante.
- Gráfica: TradingView Advanced Chart widget
  (`https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js`), cargado
  SOLO al abrir el modal por primera vez. Config: symbol `BITSTAMP:BTCUSD`, interval `D`,
  theme `dark`, locale `es`, backgroundColor `rgba(13,13,13,1)`, gridColor `rgba(247,147,26,0.06)`,
  `allow_symbol_change:false`, `hide_side_toolbar:true`.
- DCA con histórico embebido:
  `{2013:758,2014:320,2015:430,2016:963,2017:14156,2018:3742,2019:7193,2020:28990,2021:46306,2022:16547,2023:42265,2024:93429,2025:95000}`.
  Inputs: inicial, mensual, plazo (1/2/3/5/10), CAGR % (default 30, editable).
  Lógica: tasa mensual = (1+CAGR/100)^(1/12)-1; cada mes suma mensual y crece a tasa mensual;
  inicial crece todo el período; total invertido = inicial + mensual*meses;
  BTC acumulado = total invertido / precio actual CoinGecko.
  Outputs (cards): Total invertido, Valor estimado (naranja grande), Ganancia (verde si +),
  Precio estimado 1 BTC, BTC acumulado. Disclaimer educativo obligatorio abajo.

---

## 6. Secciones del landing (en orden)

1. **Header / Nav** - logo, links (El Masterclass, Comunidad, Alberto, Testimonios),
   botón "Empezá ahora". Móvil: hamburguesa + "Empezá Ya".
2. **Hero** - headline sobre inflación y Bitcoin, subtexto, VSL de YouTube (`8qDk17XCfOs`,
   con fachada/lazy), CTAs, stats (+9,000 horas / 7 horas / 1 solo pago).
3. **Dolor** - "¿Esto suena como vos?" - grid de miedos/objeciones.
4. **Transformación** - "Imaginá esto en 5 años" - 4 puntos de visión.
5. **Módulos** - Bitcoin Masterclass, 5 módulos (ver descripciones de marca).
6. **Comunidad / Bonus** - Discord, imagen `Servidor.png`, lista de canales colapsable,
   beneficios (tarifas preferenciales, soporte, networking, eventos, descuentos, análisis).
7. **Alberto** - bio del fundador, foto `alberto.png`, historia ($100K perdidos,
   +9,000 horas, +200 personas ayudadas), stats, CTA Calendly.
8. **Testimonios** - carrusel con `testi-1..6.png`. SIN cifras de rendimiento (solo screenshots).
9. **Precio** - "Tomá la decisión", tabla de valor, $147 tachado → $97, lo incluido,
   garantía 7 días, CTA al form, badges (pago seguro, Kribatta/SUGEF, acceso de por vida,
   comunidad CR).
10. **Comparativa** - "¿Por qué no aprender solo?" - tabla Aprender solo vs Masterclass.
11. **FAQ** - acordeón.
12. **Redes** - "Seguime en redes sociales".
13. **Footer** - logo, redes, links de curso, contacto, legal, disclaimer.
14. **FAB Calculadora + modal**.

---

## 7. Rendimiento

- YouTube VSL con fachada (imagen + play; iframe carga al click).
- TradingView y CoinGecko lazy (solo al abrir la calculadora).
- Imágenes WebP (ya disponibles) + `loading="lazy"` + responsive.
- Presupuesto móvil: LCP < 2.5s, Lighthouse Performance >= 90.
- GSAP anima solo `transform` / `opacity`. Respetar `prefers-reduced-motion`.

---

## 8. Reglas de marca y copy

- Voseo costarricense (vos, tenés, aprendés).
- PROHIBIDO el guion largo (—) en el copy del sitio. Usar dos puntos, comas o puntos.
- Referencias locales naturales (colones, SINPE Móvil, SUGEF, Kribatta) donde aplique.
- Tono educativo, confiado, sin hype ni promesas de enriquecimiento. Se vende educación
  y claridad, no ganancias. "Educación antes de inversión."
- Garantía oficial: **7 días**. Precio: **$97** (tachado **$147**).

### Enlaces clave
- Worker: `https://decentralize-form.decentralizecr.workers.dev`
- Calendly: `https://calendly.com/decentralizecr/30min`
- Instagram DM: `https://ig.me/m/decentralizecr`
- Kribatta: `https://web.kribatta.com/index-es.php`
- Email: `admin@decentralizecr.com`
- Redes: instagram.com/decentralizecr · tiktok.com/@decentralizecr ·
  facebook.com/decentralizecr · x.com/decentralizecr

---

## 9. Deploy (Cloudflare Pages)

- Build: `npm run build` → output `dist/`.
- Pages: preset Astro, build command `npm run build`, output dir `dist`.
- Flujo: commit → `git push` → Pages auto-despliega (1-2 min) en URL `*.pages.dev`.
- El dominio `decentralizecr.com` lo apunta el usuario al final. El repo viejo queda
  intacto como respaldo.
- `.env*` en `.gitignore`. El frontend NO maneja llaves (viven como Secrets en el Worker).

---

## 10. Definición de "terminado"

Una tarea está lista cuando:
- `astro build` pasa sin error.
- `astro check` (typecheck) en verde.
- Sin errores en consola del navegador.
- Las 5 páginas existen; `/form` con `noindex`.
- Presupuesto de performance cumplido (LCP < 2.5s, Lighthouse >= 90 móvil).
- Eventos de Pixel verificables con Meta Pixel Helper.
- El POST real al Worker responde 200 en el preview de Cloudflare.

---

## 11. Fuera de alcance de la Fase 1

El diseño visual fino (las 2-3 direcciones con referencias 2025-2026, paleta detallada,
tipografía, mockups) es **Fase 2**. La implementación es **Fase 3+**. Este spec deja la
estructura, el flujo de datos y las reglas listas.
