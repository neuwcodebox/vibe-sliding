---
name: react-slide-authoring
description: Use this skill when the user asks to create, edit, restyle, review, polish, debug, or improve slides in this React slide deck workspace, including requests that mention slide screenshots, layout issues, Edit Inspect Mode references, design guides, or files under src/slides.
---

# React Slide Authoring

## Workflow

1. Read `AGENTS.md` before editing.
2. For new slides or broad visual redesigns, confirm the user selected a guide under `designs/`; if not, ask them to choose one.
3. For small text edits or bug fixes, preserve the current slide style.
4. Inspect `src/slides.ts` and the relevant files under `src/slides/`.
5. Edit plain React components with direct JSX and Tailwind classes.
6. Keep slide-specific layout, typography, line-breaking, decoration, and visual fixes inside the relevant slide component.
7. Keep code outside `src/slides/` generic and reusable across decks.
8. Run the narrowest useful validation command.
9. For visual edits, capture affected slides when a dev server is available and inspect the screenshots before finishing.

## Slide Conventions

- Slide roots should fill the stage with `h-full w-full`.
- Slide files use three-digit numeric prefixes such as `001-title.tsx`.
- Slide components use PascalCase names such as `Slide001Title`.
- Register slide order and file paths in `src/slides.ts`.
- Add `data-ai-id` to major editable regions, not every small span.
- Use short kebab-case `data-ai-id` values such as `main-title`, `cost-chart`, or `runtime-flow-card`.
- Avoid visual-only `data-ai-id` names such as `blue-box` or `left-thing`.

## Available Slide Dependencies

Use `package.json` as the source of truth for installed packages. Prefer the existing dependencies below before adding anything new:

- React and React DOM are the app runtime. Write slides as plain React components with TypeScript-friendly JSX.
- Tailwind CSS is the primary styling system. Use direct utility classes for slide layout, typography, spacing, color, and responsive-safe fixed-stage composition.
- `clsx` and `tailwind-merge` are available for conditional class composition, especially in shared helpers or reusable runtime components. Keep simple slide JSX inline when no conditional classes are needed.
- `lucide-react` is available for icons. Prefer it for UI symbols, process markers, buttons, and visual labels instead of hand-drawn SVG icons.
- `framer-motion` is available for purposeful slide animations and transitions. Keep motion restrained and verify captures if timing affects screenshots.
- `recharts` is available for charts such as line, area, bar, pie, and axis-based data visualizations. Use stable dimensions that fit the fixed 16:9 slide stage.
- `mermaid` is available through `src/runtime/MermaidDiagram.tsx`. Prefer the existing `MermaidDiagram` component for flowcharts, sequence diagrams, and architecture diagrams instead of initializing Mermaid inside a slide.
- `@fontsource/inter` and `@fontsource/noto-sans-kr` are installed for the deck typography. Do not add remote font imports from slide files.

Development-only tooling such as Playwright, Vite, TypeScript, ESLint, and `tsx` supports preview, validation, and screenshot scripts; do not import these into slide components.

Do not add new presentation frameworks or visualization libraries unless the user explicitly asks and the current dependencies cannot reasonably handle the slide.

## Edit Inspect References

Edit Inspect Mode may provide a one-line reference such as:

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

Use the fields to locate the target JSX element. Prefer this order when matching a reference:

1. `data-ai-id`
2. visible text
3. `aria-label` or `alt`
4. tag name
5. anchored CSS path and nearest `data-ai-id` context

## Gotchas

- Do not add Reveal.js, Spectacle, Slidev, Marp, or another slide framework.
- Do not invent a custom slide DSL.
- Do not move one slide's visual workaround into runtime components or global CSS.
- Do not remove useful slide animations only to make screenshots deterministic; adjust capture timing instead.
- Browser viewport scaling affects hit-testing, so verify edit-mode coordinate changes in a browser.
