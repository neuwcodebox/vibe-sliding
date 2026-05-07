# Vibe Sliding

[Korean README](README.ko.md)

![Vibe Sliding workspace preview](docs/hero.png)

Vibe Sliding is a local workspace for asking an AI coding agent to generate, edit, and review a slide show. You run the preview server, choose a design guide, describe the deck you want, and let the agent write the React slide components.

This is not a GUI-first PowerPoint replacement. The browser is the preview and presentation surface. The files under `src/slides/` are the source files that the AI agent edits on your behalf.

## Demo Deck

The included demo deck introduces the project workflow: choose a design guide, ask the agent for a deck, inspect specific elements, and review the generated slides.

![Vibe Sliding demo slide grid](docs/demo-slides-grid.png)

## Quick Start

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. It is usually something like `http://localhost:5173/`.

## What This Project Gives You

- A local browser-based slide viewer.
- A React slide codebase that AI agents can edit reliably.
- Reusable design guides under `designs/`.
- Edit Inspect Mode for pointing at slide elements and copying precise references.
- Screenshot capture scripts for reviewing generated slides.
- Mermaid diagram rendering for flowcharts, sequence diagrams, and other technical visuals.

The intended workflow is: you describe the slide show, the agent edits the source, and you review the result in the browser.

## Controls

- Right arrow, Down arrow, Space, or click: next slide
- Left arrow or Up arrow: previous slide
- Home: first slide
- End: last slide
- `?slide=N`: open slide N directly
- `?edit=1`: enable Edit Inspect Mode

Examples:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
```

## Ask An Agent To Create A Deck

1. Choose a design guide from `designs/`.
2. Tell the agent what deck you want: topic, audience, number of slides, tone, and any required content.
3. Ask the agent to create or revise the slide components.
4. Preview the result in the browser.
5. Use screenshots or Edit Inspect Mode to request targeted fixes.

Example prompt:

```txt
Use designs/technical-grid.md. Create a 5-slide deck about our internal AI agent platform for an engineering leadership audience. Keep the style technical, structured, and presentation-ready.
```

For broad visual changes, name the design guide explicitly. For small copy edits, typo fixes, or narrow bug fixes, ask the agent to preserve the current slide style.

## Choose A Design Guide

Built-in guides:

- `designs/minimal-dark.md`
- `designs/executive-clean.md`
- `designs/technical-grid.md`
- `designs/startup-pitch.md`

Design guides are instructions for the agent. They describe visual language, density, typography, color, chart treatment, motion, and other style rules the generated slides should follow.

## What The Agent Edits

When you ask for slides, the agent usually changes these files:

- `src/slides/`: generated slide components
- `src/slides.ts`: slide registration order
- `designs/`: reusable visual guides, only when you ask for a new or revised guide

A generated slide is a default-exported React component whose root fills the fixed 16:9 stage.

```tsx
export default function Slide004Topic() {
  return <section className="h-full w-full">...</section>
}
```

The agent should register that slide in `src/slides.ts`.

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

You do not need to memorize this pattern, but it helps to know what the agent is expected to change.

## Add Mermaid Diagrams

Use `MermaidDiagram` when a slide needs a flowchart, sequence diagram, or other Mermaid-supported visual.

```tsx
import { MermaidDiagram } from '../runtime/MermaidDiagram'

const chart = `---
config:
  theme: base
  themeVariables:
    darkMode: true
    background: '#0B1020'
    primaryColor: '#111827'
    primaryTextColor: '#F8FAFC'
    primaryBorderColor: '#334155'
    lineColor: '#5EEAD4'
    fontFamily: 'Inter, Noto Sans KR, sans-serif'
---
flowchart LR
  A[Prompt] --> B[React slide]
  B --> C[Browser review]
`

export default function Slide004Topic() {
  return <MermaidDiagram chart={chart} className="h-[420px]" />
}
```

Set per-diagram themes in the chart string with YAML frontmatter. Mermaid `%%{init:...}%%` directives may still work, but frontmatter is the preferred style for new slides.

## Make Agent Edits Precise

Important titles, cards, charts, and sections should have `data-ai-id` attributes so future edits can target them clearly.

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

Use Edit Inspect Mode when you want to point at an element in the browser and ask the agent to change exactly that element.

```txt
http://localhost:5173/?slide=3&edit=1
```

When it is active, the element under the cursor is highlighted. Clicking a visible element copies a one-line reference.

```txt
@element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow")
```

Paste that reference into your next agent prompt. For example:

```txt
Change @element(slide=3 file="src/slides/003-content.tsx" target="data-ai-id=runtime-flow-title" text="Runtime flow") to make the heading shorter and align it with the chart below.
```

If clipboard access fails, the reference is shown on screen.

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

## Ask An Agent To Add A Design Guide

Ask for a new design guide when you need a new presentation tone. The agent should create a Markdown file under `designs/`.

Useful prompt:

```txt
Create a new design guide under designs/ for executive product strategy reviews. Use a restrained, high-density style with strong chart readability.
```

The agent should use `skills/design-guide-authoring/assets/design-guide-template.md` as the structure and `skills/design-guide-authoring/assets/design-guide-example.md` as a completed reference.

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

Shared infrastructure:

- `src/runtime/`: viewer runtime, scaling, navigation
- `src/edit-mode/`: element inspection and copied references
- `src/styles/global.css`: app-wide base styling

Deck-specific content:

- `src/slides/`: slide components generated by the agent
- `src/slides.ts`: slide registration order
- `designs/`: visual instructions for the agent
- `screenshots/`: captured slide images

Most deck content and visual changes should live under `src/slides/`. `runtime/`, `edit-mode/`, and `styles/global.css` should stay generic across many slide shows.
