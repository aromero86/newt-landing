# Contrato de secciones

La landing se construye en paralelo. Cada sección es **autocontenida** y vive en su
carpeta; solo `src/App.tsx` las compone (y ese fichero no se toca desde una sección).

## Reglas

1. **Tu sección vive en `src/sections/<nombre>/`.** El punto de entrada es
   `index.tsx` con `export default function …()` **sin props**. Puedes crear todos
   los ficheros que quieras dentro de tu carpeta (componentes, datos propios).
2. **No toques nada fuera de tu carpeta.** Ni `App.tsx`, ni `src/components`, ni
   `src/lib`, ni `index.css`. Si te falta algo compartido, créalo dentro de tu
   carpeta y menciónalo al terminar.
3. **Usa los componentes y el tema compartidos** (lista abajo). Nada de colores en
   hex sueltos para la UI de la landing: usa los tokens (`bg-card`, `text-brand`,
   `text-muted-foreground`, `border`, `text-ok`/`text-warn`/`text-bad`…). Los mocks
   de GitHub pueden usar sus colores de marca (verde de "Open", morado de "Merged").
4. **Las animaciones son lo importante.** Cada escenario se cuenta con una línea de
   tiempo por pasos (`useStepper`) que avanza sola mientras está en pantalla, con
   un texto que explica cada paso. Tienen que respetar `prefers-reduced-motion`
   (`useStepper` y `MotionConfig` ya lo hacen: con movimiento reducido se ve el
   último paso, quieto).
5. **Copy en inglés y castellano.** La landing está en los dos idiomas y toma el
   del navegador (el visitante puede cambiarlo con el selector EN/ES). Cada texto
   se escribe junto al componente que lo muestra, en los dos idiomas:
   ```tsx
   import { useT, type Bi } from '@/lib/i18n'
   const t = useT()
   <h2>{t({ en: 'A clear headline', es: 'Un titular claro' })}</h2>
   ```
   Para datos fuera de un componente, guárdalos como `Bi` (`{ en, es }`) y
   resuélvelos con `t(...)` al pintarlos. Sin textos sueltos en un solo idioma.
   - **Castellano natural**, no traducción literal; tuteo; frases cortas.
   - **El vocabulario del producto no se traduce**: workspace, dimension, feature,
     artifact, rule, entity, lifecycle, actor, parameter, proposal, delta,
     revision, bug, release, board, y los estados (`draft`, `accepted`,
     `merged`…). En castellano: "la proposal", "los deltas", "la definición
     vigente" (*current definition*) y "la prevista" (*planned definition*).
   - **Identificadores, código y nombres propios no cambian**: PROP-42, R-07,
     PR #318, BUG-77, v2.4.0, nombres de ficheros y de personas, diffs.
   - **La interfaz propia de GitHub se queda en inglés** (Files changed, Merge pull
     request, Open/Merged…), como es en la realidad; sí se traduce lo que escriben
     las personas y newt (títulos, comentarios, informes del check).
   - El contenido de la historia (textos de rules, títulos de proposals, mensajes
     de chat) se traduce: en castellano, Acme Shop habla castellano.

6. **Una sola historia.** Léela con `useStory()` de `@/lib/data` (Acme Shop,
   PROP-42 "Guests can pay with Bizum", PR #318, BUG-77, R-07/R-12/R-31…): devuelve
   los mismos datos en el idioma del visitante. No reescribas sus frases en tu
   sección: si te falta una, añádela a la historia en los dos idiomas. Solo se
   exportan directamente los tipos, `people` (nombres) y `dimensions` (los nombres
   en inglés, como clave). Los deltas se nombran como `nuevo`, `cambiado`,
   `retirado` (concuerdan con "delta"), también en los changelogs.
7. **Responsive hasta 360 px** y accesible: texto real (no imágenes de texto),
   `aria-hidden` en lo decorativo, contraste suficiente en claro y oscuro.
8. **Verifica antes de terminar:** `bun run build` sin errores.

## La sección

```tsx
// src/sections/<nombre>/index.tsx
import { Section, SectionHeading } from '@/components/site/section'

export default function MySection() {
  return (
    <Section id="<nombre>">  {/* el id es el ancla: #<nombre> */}
      <SectionHeading eyebrow="Short label" title="A clear headline">
        One sentence that says why this matters.
      </SectionHeading>
      {/* contenido */}
    </Section>
  )
}
```

## Lo compartido

### Página y animación

| Qué | Dónde | Para qué |
|---|---|---|
| `Section`, `SectionHeading`, `Reveal` | `@/components/site/section` | Contenedor con ancho y espaciado; titular con entrada animada; aparecer al hacer scroll |
| `useStepper(count, { interval, loop, hold })` | `@/lib/motion` | Línea de tiempo por pasos: devuelve `{ ref, step, setStep, reduced }`. Pon `ref` en el contenedor; avanza solo mientras se ve |
| `fadeUp`, `ease` | `@/lib/motion` | Variantes y curva de entrada |
| `Typing`, `useTypewriter`, `Caret` | `@/lib/typing` | Texto que se escribe solo (chat, buscador) |
| `FakeCursor` | `@/lib/typing` | Puntero simulado que se mueve (en %) y hace clic, dentro de un padre `relative` |
| `motion`, `AnimatePresence` | `motion/react` | Todo lo demás |

### Mocks

| Qué | Dónde | Para qué |
|---|---|---|
| `AppWindow` | `@/components/mock/window` | La app newt imaginada: ventana con breadcrumb y tabs estilo GitHub |
| `GitHubWindow` | `@/components/mock/window` | Una PR de github.com (con newt instalado) |
| `ChatPanel`, `ChatMessage`, `ToolCall` | `@/components/mock/chat` | Conversación con Claude conectado a newt |
| `ProposalBadge`, `DeltaBadge`, `BugBadge` | `@/components/mock/status` | Estados de proposal, delta y bug |
| `ArtifactTag`, `DimensionChip`, `CheckLine` | `@/components/mock/status` | Referencia a un artifact, valor de dimension, línea de informe ✔ ✖ ⚠ |
| Datos de ejemplo | `@/lib/data` | La historia común |

### UI (shadcn)

`@/components/ui/`: `button`, `badge` (variantes `ok`, `warn`, `bad`, `info`, `brand`,
`muted`), `card`, `tabs`, `checkbox`, `separator`, `avatar` (con letra, sin imagen).
Iconos: `lucide-react` (no trae marcas: la de GitHub es `GithubMark` en
`@/components/site/icons`).

### Tema

Oscuro por defecto, claro con el botón del menú. Tokens en `src/index.css`:
`background`, `foreground`, `card`, `muted`, `subtle`, `border`, `primary`,
`brand`, `brand-2` (degradado de marca), `ok`, `warn`, `bad`, `info`. Utilidades:
`text-gradient` (texto con el degradado de marca) y `bg-grid` (cuadrícula de fondo).

## Reparto

| Sección | Carpeta | Ancla |
|---|---|---|
| Hero | `hero` | `#hero` |
| El problema | `problem` | `#problem` |
| Cómo funciona (flujo de punta a punta) | `how` | `#how` |
| Infografías | `infographics` | `#infographics` |
| Pantallas del "GitHub adaptado" | `screens` | `#screens` |
| Integración con GitHub | `github` | `#github` |
| Por roles | `roles` | `#roles` |
| Open source y CTA final | `open-source` | `#open-source` (con `#quickstart` dentro) |
