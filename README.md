# Vibe Sliding

[Korean README](README.ko.md)

Vibe Sliding is a local workspace for building your own slide show with React components. It is not a GUI-first PowerPoint replacement. The browser is the preview and presentation surface, while the files under `src/slides/` are the editing surface.

Slides are plain React components, which makes them easy for AI coding agents to inspect and modify. Design guides live as Markdown files under `designs/`, so each deck can have a concrete visual direction.

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. It is usually something like `http://localhost:5173/`.

## Controls

- Right arrow, Space, or click: next slide
- Left arrow: previous slide
- Home: first slide
- End: last slide
- `?slide=N`: open slide N directly
- `?edit=1`: enable Edit Inspect Mode

Examples:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
```

## Build Your Slide Show

1. Choose a design guide from `designs/`.
2. Create slide components under `src/slides/`, or modify the example slides.
3. Register the slide order in `src/slides.ts`.
4. Preview the result in the browser.
5. Capture screenshots when you need to review layout details.

The fastest way to start a new deck is to copy and adapt the existing example slides. Slides render inside a fixed 16:9 stage, so think of each component as one presentation screen, not a vertically scrolling webpage.

## Choose A Design Guide

Built-in guides:

- `designs/minimal-dark.md`
- `designs/executive-clean.md`
- `designs/technical-grid.md`
- `designs/startup-pitch.md`

When creating new slides or making broad visual changes, explicitly name the guide you want to use. For example, you can ask an AI coding agent:

```txt
Use designs/technical-grid.md. Create a 5-slide deck about our internal AI agent platform.
```

For small copy edits, typo fixes, or narrow bug fixes, preserve the current slide style.

## Add A Slide

Create a new slide file:

```txt
src/slides/004-topic.tsx
```

Default-export a slide component and make the root fill the stage with `h-full w-full`.

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

Register it in `src/slides.ts`.

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

Use three-digit numeric prefixes for slide files, such as `004-topic.tsx`, and PascalCase component names, such as `Slide004Topic`.

## Make Slides Easy For AI To Edit

Add `data-ai-id` to important titles, cards, charts, and sections so you or an AI agent can refer to them precisely later.

```tsx
<h1 data-ai-id="main-title">Quarterly Roadmap</h1>
```

Good names:

- `main-title`
- `cost-chart`
- `workflow-summary`

Avoid names like:

- `blue-box`
- `left-thing`
- `big-text`

## Edit Inspect Mode

Use Edit Inspect Mode when you want to point at an element in the browser and get a source-oriented reference for it.

```txt
http://localhost:5173/?slide=3&edit=1
```

When it is active, the element under the cursor is highlighted. Clicking a visible element copies a one-line reference.

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

Paste that reference into an AI coding prompt to ask for a precise edit without describing coordinates. If clipboard access fails, the reference is shown on screen.

## Review With Screenshots

Start the dev server first.

```bash
npm run dev
```

Capture one slide:

```bash
npm run capture:slide -- 3
```

Capture all slides:

```bash
npm run capture:all
```

Screenshots are written as `screenshots/slide-001.png`, `screenshots/slide-002.png`, and so on. Generated PNG files are ignored by git.

Slides with charts or animations wait briefly before capture. You can adjust the wait time when needed.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

## Add A Design Guide

Add a design guide under `designs/` when you need a new presentation tone.

1. Use the structure from `skills/design-guide-authoring/assets/design-guide-template.md`.
2. Use `skills/design-guide-authoring/assets/design-guide-example.md` as a completed reference.
3. Save the new file as something like `designs/my-design.md`.
4. Be concrete about colors, typography, layout, visual elements, motion, Do/Don't rules, and the Agent Prompt Guide.

A design guide should define reusable visual rules across slides. It should not be a single-slide outline.

## Validation

Run typecheck:

```bash
npm run typecheck
```

Run a production build:

```bash
npm run build
```

Run lint:

```bash
npm run lint
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
public/
screenshots/
```

Commonly edited locations:

- `src/slides/`: slide components
- `src/slides.ts`: slide registration order
- `designs/`: presentation style guides
- `screenshots/`: captured slide images

Most deck content and visual changes should live under `src/slides/`. `runtime/`, `edit-mode/`, and `styles/global.css` are shared infrastructure for many slide shows.
