# Decentralize Landing Page - Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir el frontend del landing de Decentralize en Astro con diseño premium, conectándose EXACTO a la infraestructura backend existente (Worker, Pixel, Calendly, calculadora) sin tocarla.

**Architecture:** Sitio estático Astro (`output: 'static'`) con Tailwind para estilos, GSAP/ScrollTrigger + Lenis para animación, y TypeScript vanilla en islands para las 3 piezas con lógica (calculadora DCA, funnel del form, helper de Pixel). La lógica testeable se construye con TDD (Vitest); el markup y las animaciones se verifican con `astro check`, build y Playwright E2E.

**Tech Stack:** Astro, Tailwind CSS, GSAP + ScrollTrigger, Lenis, TypeScript, Vitest, Playwright, Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-06-04-decentralize-landing-design.md`

> **Nota de fases:** Este plan cubre las Fases 3-6 del framework. La ejecución NO arranca hasta cerrar la Fase 2 (Diseño), que define el sistema visual fino (paleta, tipografía, mockups) que alimenta los milestones M2+. Las tareas de markup asumen ese design system disponible.

---

## File Structure

```
astro.config.mjs               # config Astro estático + Tailwind
tailwind.config.mjs            # tokens de marca
tsconfig.json
vitest.config.ts
playwright.config.ts
package.json
src/
  layouts/BaseLayout.astro     # <head>, meta, OG, Pixel base, Lenis init
  pages/
    index.astro                # ensambla las secciones del landing
    form.astro                 # funnel (noindex)
    privacidad.astro / terminos.astro / reembolso.astro
  components/
    landing/Nav|Hero|Dolor|Transformacion|Modulos|Comunidad|Alberto|
            Testimonios|Precio|Comparativa|FAQ|Redes|Footer .astro
    calculator/CalculatorFab.astro + CalculatorModal.astro
    form/FormFunnel.astro
  scripts/
    pixel.ts                   # track() helper sobre fbq
    calculator.ts              # CoinGecko + TradingView + DCA (lógica pura: dca.ts)
    dca.ts                     # cálculo DCA puro (testeable)
    form.ts                    # buildPayload() + submit + Calendly
    animations.ts              # Lenis + ScrollTrigger setup
  styles/global.css            # Tailwind + tokens CSS
tests/
  dca.test.ts
  pixel.test.ts
  form-payload.test.ts
  e2e/critical-flows.spec.ts   # Playwright (Fase 4)
public/
  assets/images/...            # ya copiados
  favicons/ , robots.txt
```

---

## Milestone 0 - Scaffold del proyecto

### Task 0.1: Inicializar Astro + Tailwind

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.mjs`, `tsconfig.json`

- [ ] **Step 1: Crear proyecto Astro mínimo (sin template, en carpeta actual)**

Run (en `c:\Users\acede\Documents\Claude\decentralize-landing-page`):
```bash
npm create astro@latest -- --template minimal --no-install --no-git --yes .
npm install
npx astro add tailwind --yes
npm install gsap lenis
npm install -D vitest @playwright/test
```
Expected: Astro instalado, `astro.config.mjs` con integración Tailwind, sin sobrescribir `assets/`, `CLAUDE.md`, `docs/`, `.git`.

- [ ] **Step 2: Configurar output estático en `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
export default defineConfig({
  output: 'static',
  site: 'https://decentralizecr.com',
  integrations: [tailwind()],
});
```

- [ ] **Step 3: Verificar build y typecheck**

Run: `npx astro check && npm run build`
Expected: build OK, genera `dist/`.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro + Tailwind + deps"
```

### Task 0.2: Tokens de marca en Tailwind

**Files:**
- Modify: `tailwind.config.mjs`
- Create: `src/styles/global.css`

- [ ] **Step 1: Definir tokens en `tailwind.config.mjs`**

```js
export default {
  content: ['./src/**/*.{astro,html,ts,js}'],
  theme: {
    extend: {
      colors: {
        base: '#0a0a0a',
        bitcoin: '#F7931A',
      },
    },
  },
};
```

- [ ] **Step 2: `src/styles/global.css` con base oscura**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
:root { color-scheme: dark; }
html { background: #0a0a0a; color: #fff; }
@media (prefers-reduced-motion: reduce) { * { scroll-behavior: auto !important; } }
```

- [ ] **Step 3: Build + commit**

Run: `npm run build`
```bash
git add -A && git commit -m "feat: brand tokens (base #0a0a0a, bitcoin #F7931A)"
```

### Task 0.3: Configurar Vitest

**Files:**
- Create: `vitest.config.ts`

- [ ] **Step 1: `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';
export default defineConfig({ test: { environment: 'node', include: ['tests/**/*.test.ts'] } });
```

- [ ] **Step 2: Añadir script en `package.json`** → `"test": "vitest run"`, `"test:watch": "vitest"`.

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "chore: vitest config"
```

---

## Milestone 1 - Lógica testeable (TDD)

### Task 1.1: Cálculo DCA puro

**Files:**
- Create: `src/scripts/dca.ts`
- Test: `tests/dca.test.ts`

- [ ] **Step 1: Escribir test que falla**

```ts
import { describe, it, expect } from 'vitest';
import { calcularDCA } from '../src/scripts/dca';

describe('calcularDCA', () => {
  it('sin mensual: solo crece la inicial al CAGR', () => {
    const r = calcularDCA({ inicial: 1000, mensual: 0, anios: 1, cagr: 30, precioBtc: 100000 });
    expect(r.totalInvertido).toBe(1000);
    expect(r.valorEstimado).toBeCloseTo(1300, 0);
    expect(r.ganancia).toBeCloseTo(300, 0);
    expect(r.btcAcumulado).toBeCloseTo(0.01, 5);
  });
  it('con mensual: total invertido = inicial + mensual*meses', () => {
    const r = calcularDCA({ inicial: 0, mensual: 100, anios: 1, cagr: 0, precioBtc: 50000 });
    expect(r.totalInvertido).toBe(1200);
    expect(r.valorEstimado).toBeCloseTo(1200, 0); // cagr 0 => sin crecimiento
  });
  it('ganancia negativa si valor < invertido no aplica con cagr>=0', () => {
    const r = calcularDCA({ inicial: 500, mensual: 50, anios: 2, cagr: 30, precioBtc: 95000 });
    expect(r.totalInvertido).toBe(500 + 50 * 24);
    expect(r.valorEstimado).toBeGreaterThan(r.totalInvertido);
  });
});
```

- [ ] **Step 2: Correr test, verificar que falla**

Run: `npx vitest run tests/dca.test.ts`
Expected: FAIL ("calcularDCA is not a function").

- [ ] **Step 3: Implementar `src/scripts/dca.ts`**

```ts
export interface DCAInput { inicial: number; mensual: number; anios: number; cagr: number; precioBtc: number; }
export interface DCAResult { totalInvertido: number; valorEstimado: number; ganancia: number; precioBtcEstimado: number; btcAcumulado: number; }

export function calcularDCA({ inicial, mensual, anios, cagr, precioBtc }: DCAInput): DCAResult {
  const meses = anios * 12;
  const tasaMensual = Math.pow(1 + cagr / 100, 1 / 12) - 1;
  let balance = inicial;
  for (let m = 0; m < meses; m++) {
    balance = balance * (1 + tasaMensual) + mensual;
  }
  const totalInvertido = inicial + mensual * meses;
  const valorEstimado = balance;
  const ganancia = valorEstimado - totalInvertido;
  const precioBtcEstimado = precioBtc * Math.pow(1 + cagr / 100, anios);
  const btcAcumulado = precioBtc > 0 ? totalInvertido / precioBtc : 0;
  return { totalInvertido, valorEstimado, ganancia, precioBtcEstimado, btcAcumulado };
}
```

> Nota: `btcAcumulado` = total invertido / precio actual de BTC, según spec §5.6.

- [ ] **Step 4: Correr test, verificar que pasa**

Run: `npx vitest run tests/dca.test.ts`
Expected: PASS (3 tests).

- [ ] **Step 5: Commit**

```bash
git add src/scripts/dca.ts tests/dca.test.ts
git commit -m "feat: cálculo DCA puro con tests"
```

### Task 1.2: Helper de Pixel

**Files:**
- Create: `src/scripts/pixel.ts`
- Test: `tests/pixel.test.ts`

- [ ] **Step 1: Test que falla**

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { track } from '../src/scripts/pixel';

describe('track', () => {
  beforeEach(() => { (globalThis as any).fbq = vi.fn(); });
  it('estándar usa "track"', () => {
    track('Purchase', { value: 97, currency: 'USD' });
    expect((globalThis as any).fbq).toHaveBeenCalledWith('track', 'Purchase', { value: 97, currency: 'USD' });
  });
  it('custom usa "trackCustom"', () => {
    track('FormStart', undefined, true);
    expect((globalThis as any).fbq).toHaveBeenCalledWith('trackCustom', 'FormStart', undefined);
  });
  it('no rompe si fbq no existe', () => {
    delete (globalThis as any).fbq;
    expect(() => track('PageView')).not.toThrow();
  });
});
```

- [ ] **Step 2: Correr, verificar fallo**

Run: `npx vitest run tests/pixel.test.ts` → FAIL.

- [ ] **Step 3: Implementar `src/scripts/pixel.ts`**

```ts
type Fbq = (...args: unknown[]) => void;
export function track(event: string, params?: Record<string, unknown>, custom = false): void {
  const fbq = (globalThis as { fbq?: Fbq }).fbq;
  if (typeof fbq !== 'function') return;
  fbq(custom ? 'trackCustom' : 'track', event, params);
}
```

- [ ] **Step 4: Correr, verificar pasa**

Run: `npx vitest run tests/pixel.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/pixel.ts tests/pixel.test.ts
git commit -m "feat: helper de Pixel con tests"
```

### Task 1.3: Builder del payload del form

**Files:**
- Create: `src/scripts/form.ts` (solo `buildPayload` en este task)
- Test: `tests/form-payload.test.ts`

- [ ] **Step 1: Test que falla**

```ts
import { describe, it, expect } from 'vitest';
import { buildPayload } from '../src/scripts/form';

describe('buildPayload', () => {
  const base = { nombre: 'Ana', email: 'a@b.co', telefono: '888', pais: 'CR', conocimiento: 5, comoSeEntero: 'Instagram' };
  it('opcion pago en minúsculas exactas', () => {
    expect(buildPayload({ ...base, opcion: 'pago' }).opcion).toBe('pago');
  });
  it('opcion llamada en minúsculas exactas', () => {
    expect(buildPayload({ ...base, opcion: 'llamada' }).opcion).toBe('llamada');
  });
  it('mantiene los 7 campos exactos', () => {
    const p = buildPayload({ ...base, opcion: 'pago' });
    expect(Object.keys(p).sort()).toEqual(['comoSeEntero','conocimiento','email','nombre','opcion','pais','telefono']);
    expect(p.conocimiento).toBe(5);
  });
  it('rechaza opcion inválida', () => {
    // @ts-expect-error opcion inválida
    expect(() => buildPayload({ ...base, opcion: 'Pago' })).toThrow();
  });
});
```

- [ ] **Step 2: Correr, verificar fallo**

Run: `npx vitest run tests/form-payload.test.ts` → FAIL.

- [ ] **Step 3: Implementar `buildPayload` en `src/scripts/form.ts`**

```ts
export type Opcion = 'pago' | 'llamada';
export interface FormData {
  nombre: string; email: string; telefono: string; pais: string;
  conocimiento: number; comoSeEntero: string; opcion: Opcion;
}
export const WORKER_URL = 'https://decentralize-form.decentralizecr.workers.dev';

export function buildPayload(d: FormData): FormData {
  if (d.opcion !== 'pago' && d.opcion !== 'llamada') {
    throw new Error(`opcion inválida: ${d.opcion}`);
  }
  return {
    nombre: d.nombre, email: d.email, telefono: d.telefono, pais: d.pais,
    conocimiento: d.conocimiento, comoSeEntero: d.comoSeEntero, opcion: d.opcion,
  };
}

export async function submitForm(d: FormData): Promise<Response> {
  return fetch(WORKER_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildPayload(d)),
  });
}
```

- [ ] **Step 4: Correr, verificar pasa**

Run: `npx vitest run tests/form-payload.test.ts` → PASS.

- [ ] **Step 5: Commit**

```bash
git add src/scripts/form.ts tests/form-payload.test.ts
git commit -m "feat: builder del payload del form con tests"
```

---

## Milestone 2 - Layout base, animación y SEO/Pixel

### Task 2.1: BaseLayout con head, meta, OG, Pixel y Lenis

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/scripts/animations.ts`

- [ ] **Step 1: `animations.ts` (Lenis + ScrollTrigger)**

```ts
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initMotion(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;
  gsap.registerPlugin(ScrollTrigger);
  const lenis = new Lenis();
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
    gsap.from(el, { opacity: 0, y: 40, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%' } });
  });
}
```

- [ ] **Step 2: `BaseLayout.astro`** con props `title`, `description`, `noindex` (default false).
  Incluye en `<head>`: charset, viewport, title, meta description, OG tags (`og:image` =
  `/assets/images/og-image.jpg`, 1200x630), `<meta name="robots" content="noindex">` si
  `noindex`, e import de `global.css`. Incluye el snippet base de Meta Pixel con
  `fbq('init','871601738724161'); fbq('track','PageView');` y el `<noscript>` con el `tr?id=...`.
  Al final del body, `<script>` que importa e invoca `initMotion()` (con `is:inline` no;
  usar módulo) y dispara `track('ViewContent')` si aplica por página.

- [ ] **Step 3: Verificar typecheck + build**

Run: `npx astro check && npm run build`
Expected: sin errores; `dist/` generado.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "feat: BaseLayout (meta/OG/Pixel) + init de animación"
```

### Task 2.2: robots.txt y favicons

**Files:**
- Create: `public/robots.txt`

- [ ] **Step 1: `public/robots.txt`**

```
User-agent: *
Allow: /
Disallow: /form
Sitemap: https://decentralizecr.com/sitemap-index.xml
```

- [ ] **Step 2: Verificar favicons presentes** en `public/assets/images/favicons/` (mover de
  `assets/` si Astro sirve `public/`; confirmar rutas en `BaseLayout`). Build.

- [ ] **Step 3: Commit** → `git commit -am "chore: robots.txt + favicons"`.

---

## Milestone 3 - Secciones del landing

> Cada sección es un componente Astro en `src/components/landing/`, ensamblado en
> `src/pages/index.astro`. El copy exacto y los assets salen del sitio viejo
> (`C:\Users\acede\Documents\Claude\Landing Page - Decentralize\index.html`) respetando las
> reglas de marca (voseo, sin guion largo). El estilo visual sigue el design system de la
> Fase 2. Cada sección lleva `data-reveal` para la animación al scroll y dispara sus eventos
> de Pixel donde corresponde (spec §5.5). Verificación por sección: `astro check`, `npm run build`,
> y revisión visual con `astro dev` (luego Playwright en M7).

### Task 3.1: Nav + Hero

**Files:**
- Create: `src/components/landing/Nav.astro`, `Hero.astro`; `src/pages/index.astro`

- [ ] **Step 1: `Nav.astro`** - logo (`logo-white.svg`), links (El Masterclass, Comunidad,
  Alberto, Testimonios), botón "Empezá ahora" → `/form`. Móvil: hamburguesa + "Empezá Ya".
  El botón del menú dispara `track('Lead', {content_category:'Menu'})`.
- [ ] **Step 2: `Hero.astro`** - headline sobre inflación/Bitcoin, subtexto, VSL YouTube
  (`8qDk17XCfOs`) con fachada (imagen + botón play; el iframe se inyecta al click),
  CTAs (`/form`), stats (+9,000 horas / 7 horas / 1 solo pago). Al hacerse visible el VSL,
  `track('VideoVisible', undefined, true)`.
- [ ] **Step 3: `index.astro`** importa `BaseLayout`, `Nav`, `Hero`.
- [ ] **Step 4: Build + dev visual** → `npm run build`; `npx astro dev` y revisar `/`.
- [ ] **Step 5: Commit** → `git commit -am "feat: Nav + Hero"`.

### Task 3.2: Dolor + Transformación

**Files:** Create `Dolor.astro`, `Transformacion.astro`; modify `index.astro`.

- [ ] **Step 1:** `Dolor.astro` - "¿Esto suña como vos?" grid de miedos/objeciones (copy del viejo, voseo).
- [ ] **Step 2:** `Transformacion.astro` - "Imaginá esto en 5 años", 4 puntos de visión.
- [ ] **Step 3:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: Dolor + Transformación"`.

### Task 3.3: Módulos

**Files:** Create `Modulos.astro`; modify `index.astro`.

- [ ] **Step 1:** 5 módulos del Bitcoin Masterclass (descripciones de marca: Historia de la
  Moneda; Sistema Financiero Actual; Bitcoin y Blockchain; Mercado Global vs Bitcoin; De la
  Información a la Acción). Cards con `data-reveal`.
- [ ] **Step 2:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: sección Módulos"`.

### Task 3.4: Comunidad / Bonus

**Files:** Create `Comunidad.astro`; modify `index.astro`.

- [ ] **Step 1:** Discord, imagen `Servidor.png`, lista de canales colapsable (al desplegar:
  `track('DiscordToggleAbierto', undefined, true)`), beneficios (tarifas preferenciales,
  soporte, networking, eventos, descuentos, análisis).
- [ ] **Step 2:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: sección Comunidad"`.

### Task 3.5: Alberto

**Files:** Create `Alberto.astro`; modify `index.astro`.

- [ ] **Step 1:** Bio del fundador, foto `alberto.png` (usar `.webp`), historia ($100K perdidos,
  +9,000 horas, +200 personas ayudadas), stats, CTA Calendly
  (`https://calendly.com/decentralizecr/30min`, con `track('Lead',{content_category:'Calendly'})`).
- [ ] **Step 2:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: sección Alberto"`.

### Task 3.6: Testimonios (carrusel)

**Files:** Create `Testimonios.astro`; modify `index.astro`.

- [ ] **Step 1:** Carrusel con `testi-1..6` (`.webp`), SIN cifras de rendimiento. Carrusel en
  TypeScript vanilla (autoplay + swipe). Al hacerse visible: `track('TestimonioVisto', undefined, true)`.
- [ ] **Step 2:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: carrusel Testimonios"`.

### Task 3.7: Precio

**Files:** Create `Precio.astro`; modify `index.astro`.

- [ ] **Step 1:** "Tomá la decisión", tabla de valor, **$147 tachado → $97**, lista de lo incluido,
  garantía 7 días, CTA al `/form` con `track('InitiateCheckout', {value:97, currency:'USD'})`,
  badges (pago seguro, Kribatta/SUGEF, acceso de por vida, comunidad CR).
- [ ] **Step 2:** Añadir a `index.astro`. Build. Commit `git commit -am "feat: sección Precio"`.

### Task 3.8: Comparativa + FAQ + Redes + Footer

**Files:** Create `Comparativa.astro`, `FAQ.astro`, `Redes.astro`, `Footer.astro`; modify `index.astro`.

- [ ] **Step 1:** `Comparativa.astro` - tabla "Aprender solo vs Masterclass".
- [ ] **Step 2:** `FAQ.astro` - acordeón (al abrir cada item: `track('FAQAbierto', undefined, true)`).
- [ ] **Step 3:** `Redes.astro` - "Seguime en redes sociales" (IG, TikTok, FB, X). Botón IG DM
  (`https://ig.me/m/decentralizecr`) dispara `track('Contact')`.
- [ ] **Step 4:** `Footer.astro` - logo, redes, links de curso, contacto (`admin@decentralizecr.com`),
  legal (`/privacidad`, `/terminos`, `/reembolso`), disclaimer.
- [ ] **Step 5:** Añadir todo a `index.astro`. Build. Commit `git commit -am "feat: Comparativa, FAQ, Redes, Footer"`.

### Task 3.9: ScrollDepth tracking

**Files:** Modify `src/scripts/animations.ts` o nuevo `src/scripts/scroll-depth.ts`.

- [ ] **Step 1:** Disparar `track('ScrollDepth', {percent}, true)` en hitos 25/50/75/100 (una vez c/u).
- [ ] **Step 2:** Build. Commit `git commit -am "feat: tracking ScrollDepth"`.

---

## Milestone 4 - Calculadora

### Task 4.1: FAB + Modal + integración DCA/CoinGecko/TradingView

**Files:** Create `src/components/calculator/CalculatorFab.astro`, `CalculatorModal.astro`,
`src/scripts/calculator.ts`; modify `index.astro`.

- [ ] **Step 1:** `CalculatorFab.astro` - botón flotante inferior derecho con glow naranja
  "📊 Calculadora de Inversión Bitcoin". Al abrir: `track('CalculadoraOpen', undefined, true)`.
- [ ] **Step 2:** `CalculatorModal.astro` - estructura: precio vivo (punto verde pulsante),
  contenedor de gráfica TradingView, inputs DCA (inicial, mensual, plazo 1/2/3/5/10, CAGR default 30),
  cards de output, disclaimer educativo obligatorio (texto del spec §5.6).
- [ ] **Step 3:** `calculator.ts` - al abrir el modal por primera vez: fetch CoinGecko
  (`/simple/price?ids=bitcoin&vs_currencies=usd`) para precio vivo, e inyectar el script de
  TradingView (`embed-widget-advanced-chart.js`) con la config del spec. Usa `calcularDCA` de
  `dca.ts` y el `btcHistorico` embebido. Al calcular: `track('CalculadoraCalculo', undefined, true)`;
  al renderizar resultado: `track('CalculadoraResult', undefined, true)`.
- [ ] **Step 4:** Build + dev: abrir modal, confirmar precio vivo, gráfica carga solo al abrir,
  cálculo correcto vs `dca.test.ts`. Commit `git commit -am "feat: calculadora DCA (CoinGecko + TradingView)"`.

---

## Milestone 5 - Funnel del formulario (/form)

### Task 5.1: Página form + paso de datos

**Files:** Create `src/pages/form.astro`, `src/components/form/FormFunnel.astro`; usa `src/scripts/form.ts`.

- [ ] **Step 1:** `form.astro` con `BaseLayout` `noindex={true}`. Dispara `track('PageView')`,
  `track('Lead')`, `track('ViewContent')` al cargar (vía BaseLayout/inline).
- [ ] **Step 2:** `FormFunnel.astro` paso 1 - los 7 inputs: nombre, email, telefono, pais,
  `conocimiento` (slider 0-10), `comoSeEntero` (Instagram/Facebook/TikTok/Referido). Al empezar
  a escribir: `track('FormStart', undefined, true)`. Validación cliente.
- [ ] **Step 3:** Al completar datos y mostrar las opciones: `track('FormComplete', undefined, true)`.
  Configurar `FormAbandono` (beforeunload si empezó y no envió).
- [ ] **Step 4:** Build + dev. Commit `git commit -am "feat: /form paso de datos + tracking"`.

### Task 5.2: Caminos pago / llamada + éxito

**Files:** Modify `FormFunnel.astro`, `src/scripts/form.ts`.

- [ ] **Step 1:** Elegir camino: pago → `track('OpcionPago', undefined, true)`;
  llamada → `track('OpcionLlamada', undefined, true)`.
- [ ] **Step 2:** Camino pago: `submitForm({...,opcion:'pago'})` → al responder OK,
  `track('Purchase', {value:97, currency:'USD'})`, mostrar pantalla "revisá tu correo",
  `window.scrollTo(0,0)`.
- [ ] **Step 3:** Camino llamada: `submitForm({...,opcion:'llamada'})`, inyectar widget Calendly
  (`assets/external/widget.js`, url `/decentralizecr/30min`), `window.scrollTo(0,0)`,
  `track('CalendlyVisto', undefined, true)` al cargar el widget. Escuchar mensaje
  `e.data.event === 'calendly.event_scheduled'` → `track('Schedule')`, mostrar pantalla de éxito,
  `window.scrollTo(0,0)`.
- [ ] **Step 4:** Build + dev (UI/validación; el POST real se prueba en preview, CORS solo permite
  `decentralizecr.com`). Commit `git commit -am "feat: /form caminos pago/llamada + éxito"`.

---

## Milestone 6 - Páginas legales

### Task 6.1: Privacidad, Términos, Reembolso

**Files:** Create `src/pages/privacidad.astro`, `terminos.astro`, `reembolso.astro`.

- [ ] **Step 1:** Reproducir el contenido legal del repo viejo (`privacidad.html`, `terminos.html`,
  `reembolso.html`) en `BaseLayout` (indexables), con el diseño nuevo. Enlazadas desde el Footer.
- [ ] **Step 2:** Build + verificar las 3 rutas. Commit `git commit -am "feat: páginas legales"`.

---

## Milestone 7 - Pruebas (Fase 4)

### Task 7.1: Vitest completo

- [ ] **Step 1:** Correr toda la suite. Run: `npm test` → todos los tests de M1 en verde.
- [ ] **Step 2:** Commit si hubo ajustes.

### Task 7.2: Playwright E2E de flujos críticos

**Files:** Create `playwright.config.ts`, `tests/e2e/critical-flows.spec.ts`.

- [ ] **Step 1:** Config Playwright apuntando a `npm run preview` (`http://localhost:4321`).
- [ ] **Step 2:** Tests E2E:
  (a) `/` carga, hero visible, CTA navega a `/form`;
  (b) calculadora abre, precio vivo aparece, un cálculo muestra resultado;
  (c) `/form` valida campos y muestra las dos opciones;
  (d) camino pago muestra pantalla de éxito (mock del fetch al Worker para no tocar producción);
  (e) `/form` tiene meta `noindex`.

```ts
import { test, expect } from '@playwright/test';
test('CTA del hero navega a /form', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /empezá ahora/i }).first().click();
  await expect(page).toHaveURL(/\/form/);
});
test('/form es noindex', async ({ page }) => {
  await page.goto('/form');
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', /noindex/);
});
```

- [ ] **Step 3:** Run: `npx playwright test`. Expected: PASS.
- [ ] **Step 4:** Commit `git commit -am "test: E2E Playwright de flujos críticos"`.

---

## Milestone 8 - Deploy (Fase 6, tras Revisión Fase 5)

### Task 8.1: Build de producción y deploy preview a Cloudflare Pages

- [ ] **Step 1:** Confirmar `.gitignore` incluye `node_modules`, `dist`, `.env*`.
- [ ] **Step 2:** Run: `npm run build` → `dist/` limpio, sin errores.
- [ ] **Step 3:** Push: `git push origin main`. Cloudflare Pages (preset Astro, build `npm run build`,
  output `dist`) auto-despliega a una URL `*.pages.dev`.
- [ ] **Step 4:** Smoke test en la URL de preview: el POST real del form responde 200 (acá sí,
  porque el origin es de Cloudflare), Pixel dispara (Meta Pixel Helper), calculadora funciona.
- [ ] **Step 5:** El usuario apunta `decentralizecr.com` al repo nuevo cuando confirme.

---

## Self-Review (cobertura vs spec)

- §5.1-5.4 formulario/funnel → M1 (payload), M5 (UI + caminos + éxito + scroll-to-top). OK.
- §5.5 Pixel (todos los eventos) → pixel.ts (M1) + disparos en M3/M4/M5. OK.
- §5.6 calculadora → dca.ts (M1) + M4. OK.
- §6 secciones (14) → M3 + M4 (FAB). OK.
- §7 rendimiento → fachada VSL (M3.1), TradingView/CoinGecko lazy (M4), WebP, reduce-motion (M2). OK.
- §8 marca/copy → guía transversal en M3. OK.
- §9 deploy Cloudflare → M8. OK.
- §10 definición de terminado → check/build/tests/Pixel/POST verificados en M7-M8. OK.
- Páginas legales §4 → M6. OK.

Sin placeholders de tipo TODO/TBD en pasos de código (los componentes de markup describen
responsabilidad exacta + archivo + verificación; el copy literal se extrae del sitio viejo
indicado, no es inventado).
