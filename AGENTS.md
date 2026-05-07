# AGENTS.md

This file gives coding agents practical instructions for working in this repository. Product behavior and feature requirements belong in `SPEC.md`; do not duplicate detailed specs here.

## Project Overview

Vibe Sliding is a local React slide deck workspace.

- This repository is both the runtime and a starter template for users who will replace the demo deck with their own slides.
- Preserve that template boundary: deck-specific changes should stay under `src/slides/` whenever possible so downstream users can customize slides without touching runtime code.
- Vite provides the preview and presentation surface.
- Slides are plain React components.
- Source files are the editing surface.
- Design guidance lives in Markdown files under `designs/`.
- Screenshot tooling lives under `scripts/`.

## Project Structure

```txt
src/
  App.tsx                  # app shell and route-level composition
  main.tsx                 # React entrypoint
  slides.ts                # ordered slide registry
  runtime/                 # slide stage, scaling, navigation runtime
  edit-mode/               # browser edit inspect helpers
  slides/                  # individual slide components
  styles/global.css        # app-wide CSS and Tailwind import
designs/                   # reusable slide design guides
  skills/                    # Agent Skills directories
scripts/                   # screenshot capture scripts
public/                    # static assets served by Vite
screenshots/               # generated captures, ignored by git
```

## Commands

- Install dependencies with `npm install`.
- Start local preview with `npm run dev`.
- Type-check with `npm run typecheck`.
- Build with `npm run build`.
- Lint with `npm run lint`.
- Capture one slide with `npm run capture:slide -- N`.
- Capture all slides with `npm run capture:all`.
- Export an image-based PowerPoint deck with `npm run export:pptx`.

Use npm, not pnpm or yarn.

## Key Dependencies

- Runtime: React 19, Vite, Tailwind CSS 4, Framer Motion, Lucide React, Mermaid, Recharts, clsx, tailwind-merge, and PptxGenJS.
- Fonts: `@fontsource/inter` and `@fontsource/noto-sans-kr`.
- Tooling: TypeScript 6, ESLint 10, Playwright, tsx, and the Vite React plugin.

## Naming Conventions

- Slide files use a three-digit numeric prefix and kebab-case topic: `src/slides/001-title.tsx`, `src/slides/004-agent-flow.tsx`.
- Keep reusable demo-deck helpers under a clearly named subfolder such as `src/slides/_shared/`; do not place helper files next to numbered slide files in the `src/slides/` root.
- Slide components use PascalCase with the slide number and topic: `Slide001Title`, `Slide004AgentFlow`.
- Register slides in order in `src/slides.ts`.
- Keep the `file` field in `src/slides.ts` aligned with the actual slide path.
- Use `data-ai-id` values in kebab-case for major editable regions: `main-title`, `workflow-summary`, `runtime-flow-title`.
- Prefer descriptive local constants and helper names over abbreviations.

## Coding Guidelines

- Prefer direct React, TypeScript, and Tailwind classes over new abstractions.
- Keep runtime code small and focused; avoid introducing a slide framework, DSL, or broad configuration layer unless explicitly requested.
- Keep code outside `src/slides/` generic and reusable across decks; it should not encode assumptions for one specific slide, deck, visual theme, or presentation.
- Do not add demo-only behavior, visuals, transitions, or animation defaults to runtime components. Put demo-deck animation and visual polish in `src/slides/`, including slide-local helpers when reuse is useful.
- Put slide-specific layout and visual fixes in the relevant slide file.
- Use `src/styles/global.css` only for app-wide base styling, font setup, and runtime-level behavior.
- Do not solve a single slide's visual issue by changing runtime components or global CSS.
- Do not store a selected design guide in code or config.
- Use `public/assets/` for static assets that need stable browser URLs.
- Keep comments sparse and useful; prefer readable JSX and small helpers.

## Slide Editing Workflow

- For new slides or broad visual redesigns, ask for or use an explicit design guide from `designs/`.
- For small text edits and bug fixes, preserve the current slide style.
- Keep slide roots full-stage with `h-full w-full`.
- Keep each slide inside the fixed 16:9 stage; do not rely on viewport reflow.
- Add `data-ai-id` to important editable elements, especially on complex slides.
- After visual edits, capture screenshots and inspect the result when possible.

## Runtime And Edit-Mode Work

- Treat `SPEC.md` as the source of truth for runtime behavior.
- Keep navigation, scaling, stage rendering, and edit inspect code separated by existing module boundaries under `src/runtime/` and `src/edit-mode/`.
- When changing hit-testing or copied edit references, verify behavior in the browser because viewport scaling affects coordinates.
- Avoid clipboard assertions in automated tests; validate visible UI feedback instead.

## Git Workflow

- Use Conventional Commits for git commit messages, such as `feat: add slide capture shortcut` or `fix: preserve scaled hit target coordinates`.
- Keep commit subjects concise and imperative.

## Verification

- Run the narrowest command that gives confidence for the change.
- For TypeScript or runtime changes, run `npm run typecheck` at minimum.
- For visual slide changes, run the relevant screenshot capture command when a dev server is available.
- For PPTX export changes, run `npm run export:pptx` when a dev server is available.
- For docs-only changes, `git diff --check` is usually sufficient.
