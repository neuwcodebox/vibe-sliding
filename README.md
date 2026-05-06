# Vibe Sliding

Vibe Sliding is a local React slide deck workspace for AI-assisted slide authoring. Slides are plain React components, Vite is the live preview server, and design guides under `designs/` give coding agents concrete visual direction.

This is not a PPT editor. The browser is the preview and presentation surface, and source files are the editing surface.

## Installation

```bash
npm install
```

## Local Development

```bash
npm run dev
```

Open the Vite URL and use:

- Right arrow, space, or click: next slide
- Left arrow: previous slide
- Home: first slide
- End: last slide
- `?slide=N`: open a specific slide
- `?edit=1`: enable Edit Inspect Mode

## Validation

```bash
npm run typecheck
npm run build
```

## Slide Creation Workflow

1. Choose a design guide under `designs/`.
2. Create a new default-exported React component under `src/slides/`.
3. Keep the component full-stage with `h-full w-full`.
4. Use Tailwind utilities directly in JSX.
5. Add `data-ai-id` to major editable regions.
6. Register the slide in `src/slides.ts`.
7. Preview and capture screenshots when possible.

New slide creation and broad visual changes should explicitly choose a design file under `designs/`. Do not store that selection in a config file.

## Design Guide Selection

Built-in guides:

- `designs/minimal-dark.md`
- `designs/executive-clean.md`
- `designs/technical-grid.md`
- `designs/startup-pitch.md`

Example prompt:

```txt
Use designs/technical-grid.md. Create a 5-slide deck about the internal AI agent platform.
```

For small text edits or bug fixes, preserve the existing slide style.

## Screenshot Capture

Start the dev server first:

```bash
npm run dev
```

Then capture one slide or all slides:

```bash
npm run capture:slide -- 3
npm run capture:all
```

Screenshots are written to `screenshots/slide-001.png`, `screenshots/slide-002.png`, and so on. Generated PNG files are ignored by git.

## Edit Inspect Mode

Enable it with:

```txt
http://localhost:5173/?slide=3&edit=1
```

When active, hover highlights the current target and clicking a visible element copies a one-line reference such as:

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

If clipboard access fails, the reference is shown on screen for manual copying.

## Adding a New Design Guide

1. Copy the structure from `designs/_template.md`.
2. Save the new guide under `designs/`.
3. Include concrete color, typography, layout, visual element, motion, do, don't, responsive behavior, and agent prompt guidance.
4. Keep guidance reusable and specific enough for a coding agent to implement.

## Adding a New Slide

1. Create `src/slides/004-topic.tsx`.
2. Default-export a React component.
3. Use a full-stage root element, for example:

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

4. Register it in `src/slides.ts`:

```ts
import Slide004 from './slides/004-topic'

export const slides = [
  // existing slides
  {
    component: Slide004,
    file: 'src/slides/004-topic.tsx',
  },
]
```

## Project Structure

```txt
src/
  App.tsx
  slides.ts
  runtime/
  edit-mode/
  slides/
  styles/
designs/
skills/
scripts/
screenshots/
```
