# FRAMEWORK.md — Cómo trabajamos (7 fases + cheat sheet)

> Copia versionada dentro del proyecto del documento maestro
> `Framework_Trabajo_por_Fases.docx` (Claude Code + Cursor · Junio 2026).
> Define el ciclo de vida de 7 fases, las herramientas por fase y las reglas de oro.

## Nota de adaptación al stack real de Decentralize

El documento maestro está escrito para un stack genérico **Next.js / Supabase / Vercel**.
Este proyecto usa otro stack y por eso, donde el original menciona esas herramientas, acá
aplica la siguiente equivalencia (el resto del framework se respeta igual):

- **Deploy: Cloudflare Pages**, no Vercel. `astro build` → `dist/` → auto-deploy on push.
  Donde el original dice `deploy-to-vercel` / `vercel MCP` / `vercel-optimize`, acá es el
  flujo de Cloudflare Pages (preview primero, producción al confirmar).
- **Sin Supabase ni base de datos.** El sitio es estático (Astro `output: 'static'`). No hay
  `supabase MCP`. El único backend es el Cloudflare Worker del formulario, que NO se toca.
- **Framework: Astro v6 + Tailwind v4 + TypeScript vanilla en islands**, no Next.js/React.
- **The Architect** ya corrió en Fase 1: el `blueprint.md` ya existe.
- **Sentry** es opcional; al ser estático, el monitoreo post-deploy se hace con smoke test
  de Playwright y revisión manual en Cloudflare.

---

## Las 7 fases

Todo proyecto sigue el mismo ciclo. Se van **en orden, una a la vez**. No se pasa a la
siguiente fase hasta que el cliente confirme que la actual está lista.

```
1 Plan → 2 Diseño → 3 Desarrollo → 4 Pruebas → 5 Revisión → 6 Deploy → 7 Mantenimiento
```

### Fase 1 · Planeamiento / Inicialización
**Objetivo:** definir qué se va a construir antes de escribir código.
- Crear el repo en GitHub primero y agregarlo al fine-grained token de GitHub.
- Correr **The Architect**: responde preguntas y genera un `blueprint.md` con stack, esquema
  de datos, rutas API, componentes principales y orden de build.
- Generar el plan de ejecución con **superpowers** (`/brainstorm` → `/write-plan`) o con
  `/ultraplan` (plan interactivo en la nube, se puede comentar antes de ejecutar).
- Crear y ajustar **CLAUDE.md**: correr `/init` para un borrador, recortarlo a <200 líneas,
  declarar el stack explícito y una lista de "NO usar". Definir "terminado" = lint + typecheck
  + pruebas en verde.
- Herramientas: the-architect · superpowers · /ultraplan · CLAUDE.md · context7

### Fase 2 · Diseño (UI/UX)
**Objetivo:** definir el sistema de diseño y la apariencia antes de codear.
- Dejar que **ui-ux-pro-max** genere el sistema de diseño (estilo, paleta, tipografía) según
  el tipo de producto y el cliente (50+ estilos, 161 paletas, 57 combinaciones tipográficas).
- Dar referencias visuales claras: propósito, tono de marca, familia de color preferida.
- Para los textos (titulares, subtítulos, CTAs) apoyarse en **writing-guidelines**.
- ui-ux-pro-max corre también una revisión de accesibilidad: contraste, focus states, ARIA,
  touch targets.
- Herramientas: ui-ux-pro-max · web-design-guidelines · writing-guidelines

### Fase 3 · Desarrollo
**Objetivo:** construir la app con buenas prácticas y sin deuda técnica.
- **superpowers** maneja el ciclo completo automático: brainstorm → plan → TDD (rojo/verde)
  → revisión en dos etapas. Se activa solo.
- **context7** para documentación actualizada de librerías (evita APIs viejas o inexistentes).
  Usarlo especialmente con Astro, Tailwind v4, GSAP y three.js.
- **security-guidance** corre automático al editar y hacer commit.
- **Disciplina de contexto (crítico):** vigilar con `/context`; comprimir con `/compact` al
  ~50%; limpiar con `/clear` al cambiar de tarea; desconectar con `/mcp` los servidores que
  no se usen para recuperar tokens.
- Revisar cada archivo en la terminal antes de aceptarlo (defensa contra inyección de prompts).
- Por proyecto: instalar Vitest para unitarias. (Aquí NO hay Supabase MCP.)
- Herramientas: superpowers · context7 · security-guidance · gh CLI

### Fase 4 · Pruebas (Testing)
**Objetivo:** verificar que todo funciona antes de revisar y deployar.
- **Vitest** para unitarias y de componentes: rápido, nativo TS/ESM. Correrlo a medida que se
  desarrolla, no solo al final.
- **Playwright** para E2E: cubrir flujos críticos (formulario / dos caminos pago-llamada,
  calculadora, happy paths principales).
- **Pirámide de testing:** muchas unitarias rápidas + pocas E2E. No duplicar cobertura.
- Herramientas: Vitest · playwright (plugin + MCP)

### Fase 5 · Revisión / Pre-lanzamiento
**Objetivo:** auditar seguridad, rendimiento, SEO y accesibilidad antes de publicar.
- Seguridad — `/cyber-neo .`: escaneo OWASP Top 10, CWE Top 25 y 60+ patrones de secretos.
  Complementa a security-guidance; este es el escaneo final completo.
- Código — `/code-review`: subagente independiente que revisa los cambios sin apego al plan.
- Rendimiento — auditoría de Core Web Vitals y caché (en este proyecto: Lighthouse + revisión
  de Cloudflare Pages, en lugar de vercel-optimize).
- SEO — **claude-seo**: auditoría completa de SEO on-page.
- Accesibilidad/UX — **ui-ux-pro-max**: contraste, focus states, ARIA, estados de carga,
  touch targets.
- Herramientas: cyber-neo · code-review · (Lighthouse/CWV) · claude-seo · ui-ux-pro-max

### Fase 6 · Lanzamiento / Deploy
**Objetivo:** publicar y confirmar que todo funciona en producción.
- Desplegar a **Cloudflare Pages** (`astro build` → `dist/`, auto-deploy on push).
- Variables de entorno: en el dashboard de Cloudflare, nunca en git. Confirmar que `.env*`
  está en `.gitignore`. (Este frontend no maneja ninguna API key.)
- **Por defecto siempre deploy a preview.** Producción solo cuando se pide explícitamente.
- Post-deploy: prueba de humo con Playwright en los flujos críticos; vigilar errores nuevos
  en la primera hora.
- Herramientas: Cloudflare Pages · playwright · (sentry opcional)

### Fase 7 · Mantenimiento
**Objetivo:** mantener el proyecto y el ambiente sanos a lo largo del tiempo.
- **Semanal:** `git pull` de los repos de agentes (rutina automática), dejar que los plugins
  se autoactualicen al abrir Cursor, revisar avisos de seguridad de npm.
- **Mensual:** auditar la lista de MCP activos; rotar tokens (GitHub PAT, Cloudflare).
- **Cada 90 días:** renovar el fine-grained PAT de GitHub con todos los repos del período.
- Antes de cada `npm install` de un paquete desconocido: verificarlo en socket.dev. Preferir
  versiones fijas.
- Herramientas: rutina weekly-repo-updates · recordatorio de calendario

---

## Cheat Sheet — qué herramienta usar en cada momento

| Fase | Herramienta principal | Acción / comando |
|------|-----------------------|------------------|
| 1 · Plan | the-architect + superpowers | Genera `blueprint.md` → `/write-plan` o `/ultraplan` |
| 1 · Plan | CLAUDE.md | `/init` → recortar a <200 líneas, declarar stack |
| 2 · Diseño | ui-ux-pro-max | Sistema de diseño automático (50+ estilos) |
| 2 · Diseño | writing-guidelines | Textos, titulares y CTAs de landing pages |
| 3 · Desarrollo | superpowers | Ciclo automático: brainstorm → TDD → review |
| 3 · Desarrollo | context7 | Documentación actualizada de librerías |
| 3 · Desarrollo | security-guidance | Corre automático al editar y hacer commit |
| 4 · Pruebas | Vitest | `npm install -D vitest ...` (unitarias) |
| 4 · Pruebas | playwright | Pruebas E2E de flujos críticos |
| 5 · Revisión | cyber-neo | `/cyber-neo .` (OWASP + secretos) |
| 5 · Revisión | code-review + (Lighthouse/CWV) | `/code-review` + auditoría de rendimiento |
| 5 · Revisión | claude-seo + ui-ux-pro-max | SEO + accesibilidad final |
| 6 · Deploy | Cloudflare Pages | Preview primero → producción al confirmar |
| 6 · Deploy | playwright | Smoke test post-deploy |
| 7 · Manten. | rutina semanal | git pull repos + rotar tokens c/90 días |

---

## Reglas de oro

1. **No pasar a la siguiente fase sin confirmar la actual.**
2. **Nunca subir secretos a git.** Siempre `.env*` en `.gitignore`.
3. **Deploy a preview primero;** producción solo al confirmar.
4. **Revisar cada archivo de Claude antes de aceptarlo.**
5. **Menos herramientas activas = más contexto disponible = mejores resultados.**
6. **Si el contexto se pierde,** releer los 4 archivos de memoria del proyecto
   (PROGRESS.md → FRAMEWORK.md → CLAUDE.md → blueprint.md) y retomar desde ahí.
