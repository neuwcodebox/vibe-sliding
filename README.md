# Vibe Sliding

[Korean README](README.ko.md)

![Vibe Sliding workspace preview](docs/hero.png)

Vibe Sliding is a local workspace for asking an AI coding agent to generate, edit, and review a slide show. You run the preview server, choose a theme, describe the deck you want, and let the agent write the React slide components.

This is not a GUI-first PowerPoint replacement. The browser is the preview and presentation surface. The files under `src/slides/` are the source files that the AI agent edits on your behalf.

## Demo Deck

The included demo deck introduces the project workflow: choose a theme leaf, ask the agent for a deck, inspect specific elements, and review the generated slides.

View the hosted demo at [https://neuwcodebox.github.io/vibe-sliding/](https://neuwcodebox.github.io/vibe-sliding/).

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
- A single catalog of peer theme collections under `designs/`.
- Edit Inspect Mode for pointing at slide elements and copying precise references.
- A separate Presenter View with speaker notes, slide navigation, timing, and audience controls.
- Screenshot capture scripts for reviewing generated slides.
- Image-based and experimental editable PPTX export for sharing rendered decks in PowerPoint.
- Mermaid diagram rendering for flowcharts, sequence diagrams, and other technical visuals.

The intended workflow is: you describe the slide show, the agent edits the source, and you review the result in the browser.

## Controls

- Right arrow, Down arrow, Space, or click: next slide
- Left arrow or Up arrow: previous slide
- Home: first slide
- End: last slide
- `?slide=N`: open slide N directly
- `?edit=1`: enable Edit Inspect Mode
- `P`: open Presenter View in a popup

Presenter View keeps the audience screen clear while showing the current and next
slide, speaker notes, elapsed time, and slide navigation.

Presentation shortcuts:

- `B` / `W`: toggle the audience screen to black / white
- `F`: freeze or resume the audience screen
- `R`: toggle the laser pointer
- `D`: toggle pen annotations
- `Z`: undo the last pen stroke
- `C`: clear the current slide's annotations

For a one-monitor presentation, use the small translucent expand button at the
bottom-center of the audience screen. It provides black/white, laser, pen, and clear
controls, with the same `B`, `W`, `R`, `D`, `Z`, and `C` shortcuts. Use `F` there to enter
or exit fullscreen.

Examples:

```txt
http://localhost:5173/?slide=3
http://localhost:5173/?slide=3&edit=1
http://localhost:5173/?slide=3&presenter=1
```

## Ask An Agent To Create A Deck

1. Choose one theme leaf from a collection in `designs/README.md`, or explicitly ask the agent to choose one for you.
2. Tell the agent what deck you want: topic, audience, number of slides, tone, and any required content.
3. Ask the agent to create or revise the slide components.
4. Preview the result in the browser.
5. Use screenshots or Edit Inspect Mode to request targeted fixes.

Example prompt:

```txt
Use designs/basics/technical-grid.md. Create a 5-slide deck about our internal AI agent platform for an engineering leadership audience. Keep the style technical, structured, and presentation-ready.
```

For broad visual changes, name one theme leaf explicitly or delegate that choice
to the agent. If neither happens, the agent should ask before changing the
visual system. For small copy edits, typo fixes, or narrow bug fixes, ask the
agent to preserve the current slide style.

## Choose A Theme Leaf

[`designs/README.md`](designs/README.md) is the catalog and selection guide.
Its collections are peers: their maintenance and licensing differ, but neither
outranks the other at deck-selection time.

| Collection | Selectable leaf | Browse it with |
| --- | --- | --- |
| [`basics/`](designs/basics/README.md) | One `<theme>.md` file listed in its README | The collection README |
| [`beautiful-html-templates/`](designs/beautiful-html-templates/) | One `templates/<theme>/` directory | `index.json`, then shortlisted metadata |

Name one leaf for a new deck or broad redesign, or explicitly ask the agent to
choose one. The collection README, `index.json`, license, and provenance files
help with browsing; they are not themes themselves. Two themes should not be
co-equal systems in the same deck, and the selected theme is never stored in a
config file.

Examples:

```txt
Use designs/basics/technical-grid.md as the theme. Create a 5-slide architecture review for engineering leaders.
```

```txt
Use designs/beautiful-html-templates/templates/cobalt-grid/ as the theme. Create a 5-slide product demo for engineering leaders.
```

For Beautiful HTML Templates, the agent first searches `index.json`, reads only
the most relevant candidates' metadata and design notes, and opens a selected
template's HTML source only when an implementation detail is needed. It keeps
the template's visual grammar while using your content, the fixed 1920×1080
React stage, and the installed font stack. It never imports upstream HTML
runtime, sample copy, navigation, or remote-font setup.

## What The Agent Edits

For ordinary deck creation or revision, the agent usually changes these files:

- `src/slides/`: generated slide components
- `src/slides.ts`: slide registration order

`designs/` changes only when you explicitly request a reusable theme addition or
revision, or an update to the source-preserving external snapshot. Choosing a
theme for a deck does not modify its collection.

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
    // Optional Presenter View script. It is never shown to the audience.
    notes: ['Introduce the decision first.', 'Pause here for questions.'],
  },
]
```

`notes` is optional. When present, each string becomes a separate paragraph in the
Presenter View script panel; it never appears on the audience screen. You do not
need to memorize this pattern, but it helps to know what the agent is expected to change.

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

After changing the included demo deck, refresh the checked-in grid used above:

```bash
npm run capture:all
npm run capture:demo-grid
```

The grid uses only the slides currently registered in `src/slides.ts` and is
written to `docs/demo-slides-grid.png`.

Slides with charts or animations wait briefly before capture. You can adjust the wait time when needed.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

## Export To PowerPoint

PPTX export uses the same browser rendering path as screenshots. Start the dev
server first.

```bash
npm run dev
```

Export all registered slides as image-based slides to the default path:

```bash
npm run export:pptx
```

Export to a custom path:

```bash
npm run export:pptx -- exports/demo.pptx
```

The output is written as `exports/vibe-sliding.pptx` by default. Generated PPTX
files are image-based: each slide is inserted as a full-slide PNG, so PowerPoint
can present the deck but cannot edit individual text boxes, shapes, charts, or
diagrams.

You can also create an experimental editable PPTX:

```bash
npm run export:pptx:editable
```

Custom editable output paths work the same way:

```bash
npm run export:pptx:editable -- exports/demo-editable.pptx
```

Editable export writes `exports/vibe-sliding-editable.pptx` by default. It uses
`dom-to-pptx` to convert the unscaled 1920x1080 slide DOM into PowerPoint text,
shape, image, and SVG objects where possible. Use this when editability matters,
but prefer the image-based export when visual fidelity is more important. Some
charts, Mermaid diagrams, SVGs, advanced CSS, and effects may be partially
converted or exported as SVG/image objects instead of fully native PowerPoint
objects.

You can point either export script at a different dev server URL:

```bash
SLIDE_BASE_URL=http://localhost:4173 npm run export:pptx
SLIDE_BASE_URL=http://localhost:4173 npm run export:pptx:editable
```

Slides with charts or animations wait briefly before export. Adjust the wait time
when needed.

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run export:pptx
SLIDE_CAPTURE_SETTLE_MS=2000 npm run export:pptx:editable
```

## Ask An Agent To Add A Basics Theme

Ask for a new Basics theme only when no existing leaf in either collection
provides a direction you expect to reuse. The agent should create a Markdown
file under `designs/basics/`.

Useful prompt:

```txt
Create a new Basics theme under designs/basics/ for executive product strategy reviews. Use a restrained, high-density style with strong chart readability.
```

The agent should use `skills/design-guide-authoring/assets/design-guide-template.md` as the structure and `skills/design-guide-authoring/assets/design-guide-example.md` as a completed reference.

A Basics theme should define reusable visual rules across slides. It should not
be a single-slide outline or a duplicate restatement of an upstream theme.

## Deploy To GitHub Pages

This project can publish the production build in `dist/` with GitHub Actions. The included workflow deploys automatically when `main` is pushed, and it can also be started manually from the Actions tab.

The deployment base path is controlled with `VITE_BASE_PATH` instead of being hard-coded in `vite.config.ts`. For this repository's project site, the workflow sets:

```txt
VITE_BASE_PATH=/vibe-sliding/
```

If you fork the project, rename the repository, or use a custom domain, update `VITE_BASE_PATH` in `.github/workflows/deploy-pages.yml`. Use `/` when the app is served from the domain root. See `.env.example` for local examples.

In GitHub, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**.

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
  README.md
  basics/
  beautiful-html-templates/
skills/
scripts/
public/
screenshots/
exports/
```

Shared infrastructure:

- `src/runtime/`: viewer runtime, scaling, navigation
- `src/edit-mode/`: element inspection and copied references
- `src/styles/global.css`: app-wide base styling

Deck-specific content:

- `src/slides/`: slide components generated by the agent
- `src/slides.ts`: slide registration order
- `designs/`: the theme-collection catalog, Basics themes, and source-preserved themes
- `screenshots/`: captured slide images
- `exports/`: generated PPTX files

Most deck content and visual changes should live under `src/slides/`. `runtime/`, `edit-mode/`, and `styles/global.css` should stay generic across many slide shows.

## Third-Party Sources

- [`yetone/kill-ai-slop`](https://github.com/yetone/kill-ai-slop) — [Apache-2.0](.agents/skills/kill-ai-slop/LICENSE), preserved in [`.agents/skills/kill-ai-slop/`](.agents/skills/kill-ai-slop/).
- [`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates) — [MIT](designs/beautiful-html-templates/LICENSE), preserved in [`designs/beautiful-html-templates/`](designs/beautiful-html-templates/).
