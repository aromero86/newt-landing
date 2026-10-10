# newt — landing

Landing page for [newt](#), the living definition of your product. Static site:
Vite + React 19 + Tailwind v4 + shadcn/ui + motion.

```sh
bun install
bun run dev        # http://localhost:5173
bun run build      # static site in dist/
bun run preview    # serves dist/ on :4173
```

- Page composition: `src/App.tsx`. Each section is self-contained in
  `src/sections/<name>/` — see `CONTRIBUTING-SECTIONS.md`.
- Before publishing: fill in `REPO_URL` and `DOCS_URL` in `src/lib/links.ts`.
- Screenshots: `bun scripts/shoot.ts <url> <outDir> <shots.json>` drives Chromium
  through DevTools and captures several moments of each animation. The latest
  set is in `screenshots/final/`.
