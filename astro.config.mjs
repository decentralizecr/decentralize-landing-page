// @ts-check
import { defineConfig } from 'astro/config';

// Tailwind v4 is wired via PostCSS (postcss.config.mjs) instead of the Vite
// plugin, because Astro 6's rolldown-vite is not yet compatible with
// @tailwindcss/vite (Missing field `tsconfigPaths` binding error).
// https://astro.build/config
export default defineConfig({
  output: 'static',
  site: 'https://decentralizecr.com',
});
