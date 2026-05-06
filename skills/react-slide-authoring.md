# React Slide Authoring Skill

## Use this skill when

The user asks to create, edit, restyle, review, or improve slides.

## Required Design Guide

For new slides or broad visual changes, check whether the user explicitly selected a file under `designs/`.

If no design guide was selected, do not proceed with slide generation. Ask the user to choose one.

For small text edits or bug fixes, preserve the existing style.

## Workflow

1. Read `AGENTS.md`.
2. Read the selected `designs/*.md`.
3. Inspect `src/slides.ts`.
4. Inspect relevant files under `src/slides/`.
5. Create or edit plain React slide components.
6. Keep runtime files minimal.
7. Avoid adding new dependencies unless clearly useful.
8. Run typecheck/build when possible.
9. Capture screenshots of affected slides.
10. Review screenshots for visual issues.
11. Iterate until the slide looks acceptable.

## Edit Inspect References

The browser may provide one-line edit references copied from edit inspect mode.

Example:

`@element(slide=3 file="src/slides/003-architecture.tsx" target="data-ai-id=runtime-flow-title" text="Agent Runtime Flow")`

Use the reference to locate the target JSX element.

Priority:

1. `data-ai-id`
2. visible text
3. tag name
4. aria-label or alt
5. nearby JSX structure

## `data-ai-id` Recommendations

- Add `data-ai-id` to major editable regions, not every small span.
- Use short kebab-case names.
- Prefer semantic names such as `main-title`, `cost-chart`, or `runtime-flow-card`.
- Avoid visual-only names such as `blue-box` or `left-thing`.

## Constraints

- Do not add Reveal.js, Spectacle, Slidev, Marp, or other slide frameworks.
- Do not invent a custom slide DSL.
- Keep slide-specific styling in Tailwind utilities where practical.
