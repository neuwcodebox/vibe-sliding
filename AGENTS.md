# AGENTS.md

This is a React-based slide deck workspace for AI-assisted slide authoring.

## Core Rules

- Use npm, not pnpm.
- Slides are plain React components under `src/slides/`.
- Register slide order in `src/slides.ts`.
- Keep the runtime minimal.
- Do not introduce a slide framework, DSL, or heavy abstraction unless explicitly requested.
- Prefer direct JSX and Tailwind classes.
- Keep each slide within the fixed 16:9 slide stage.
- Use `public/assets/` for static assets.
- Do not store the selected design guide in a config file.
- For new slides or broad visual edits, the user must explicitly choose a file under `designs/`.
- If the user does not choose a design guide, ask them to choose one.
- For small text edits or bug fixes, preserve the current visual style.
- When creating complex slides, add `data-ai-id` to major editable elements.
- After visual changes, capture screenshots and review the result when possible.

## Runtime Notes

- The logical slide stage is `1920 x 1080`.
- Browser viewport changes must scale the stage, not reflow slide layout.
- URL slide numbers are 1-based: `?slide=1`.
- Edit Inspect Mode is enabled with `?edit=1` and copies one-line edit references.
