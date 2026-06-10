# Fase 3 — Scaffold M0 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Crear el scaffold completo de Astro v6 con Tailwind v4, TypeScript strict, Vitest y Playwright, listo para portar el hero aprobado.

**Architecture:** Astro v6 con `output: 'static'`, Tailwind v4 vía plugin Vite (`@tailwindcss/vite`), TypeScript strict, islands TS vanilla. Sin framework SPA. Tests con Vitest (unit) + Playwright (E2E). Deploy: Cloudflare Pages.

**Tech Stack:** Astro v6, Tailwind CSS v4, TypeScript strict, Vitest, Playwright, GSAP, Lenis

---

### Task 1: Scaffold Astro + Tailwind v4

**Files:**
- Create: `astro.config.mjs`
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `src/env.d.ts`

- [ ] **Step 1: Ejecutar scaffold**

```bash
npm create astro@latest . -- --template minimal --add tailwind --typescript strict --install --no-git --yes
```

Expected: carpetas `src/`, `public/` creadas. `package.json` con `astro` y dependencias de tailwind.

- [ ] **Step 2: Verificar que TypeScript está en modo strict**

Abrir `tsconfig.json` y confirmar que extiende `astro/tsconfigs/strictest` o tiene `"strict": true`.
Si no, reemplazar el `extends` por `"astro/tsconfigs/strictest"`.

- [ ] **Step 3: Configurar output static en astro.config.mjs**

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Commit**

```bash
git add src/ public/ package.json package-lock.json astro.config.mjs tsconfig.json
git commit -m "feat(M0): scaffold Astro v6 + Tailwind v4 + TypeScript strict"
```

---

### Task 2: Vitest + Playwright

**Files:**
- Create: `vitest.config.ts`
- Create: `playwright.config.ts`
- Modify: `package.json` — scripts `test` y `test:e2e`

- [ ] **Step 1: Instalar Vitest**

```bash
npm install -D vitest
```

- [ ] **Step 2: Crear vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/unit/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Instalar Playwright**

```bash
npm install -D @playwright/test
npx playwright install --with-deps chromium
```

- [ ] **Step 4: Crear playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 14'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

- [ ] **Step 5: Actualizar scripts en package.json**

Confirmar que `package.json` tenga:
```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run",
  "test:e2e": "playwright test",
  "lint": "astro check",
  "typecheck": "astro check"
}
```

- [ ] **Step 6: Crear carpetas de tests**

```bash
mkdir -p tests/unit tests/e2e
```

- [ ] **Step 7: Commit**

```bash
git add vitest.config.ts playwright.config.ts tests/ package.json package-lock.json
git commit -m "feat(M0): vitest + playwright configurados"
```

---

### Task 3: Design Tokens + BaseLayout

**Files:**
- Create: `src/styles/global.css`
- Create: `src/layouts/BaseLayout.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Crear global.css con tokens del prototipo aprobado**

```css
/* src/styles/global.css */
@import "tailwindcss";

:root {
  --gold:        #F7931A;
  --gold-soft:   #FFB347;
  --ember:       #E8720C;
  --text-bright: #FFFFFF;
  --text:        #D8E0ED;
  --muted:       #8892a4;
  --bg:          #070708;
  --border:      rgba(255,255,255,0.10);
  --border-warm: rgba(247,147,26,0.35);
  --maxw:        1200px;
  --font-display: 'Space Grotesk', system-ui, sans-serif;
  --font-sans:    'Inter', system-ui, sans-serif;
  --font-mono:    'JetBrains Mono', monospace;
}

html { background: var(--bg); color: var(--text); scroll-behavior: smooth; }
body { margin: 0; font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
*, *::before, *::after { box-sizing: border-box; }

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
  html { scroll-behavior: auto; }
}
```

- [ ] **Step 2: Crear BaseLayout.astro**

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title?: string;
  description?: string;
  noindex?: boolean;
}
const {
  title = 'Bitcoin Masterclass — Decentralize',
  description = 'Aprendé cómo funciona el dinero de verdad. 7 horas, un solo pago, acceso de por vida.',
  noindex = false,
} = Astro.props;
---
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  {noindex && <meta name="robots" content="noindex" />}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;450;500;550;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body>
  <slot />
</body>
</html>
```

- [ ] **Step 3: Importar global.css en BaseLayout**

Agregar en el `<head>` de BaseLayout:
```astro
import '../styles/global.css';
```

- [ ] **Step 4: Verificar build limpio**

```bash
npm run build
```

Expected: `dist/` generado sin errores. `npm run typecheck` sin errores.

- [ ] **Step 5: Commit**

```bash
git add src/styles/ src/layouts/ src/pages/
git commit -m "feat(M0): design tokens + BaseLayout + global.css"
```
