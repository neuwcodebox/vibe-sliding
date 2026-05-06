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
