# SPEC.md

# React AI Slides Specification

## 1. Purpose

This project provides a local React-based slide deck workspace for AI-assisted slide authoring.

The goal is to let a coding AI agent create, revise, and visually inspect web-based presentation slides inside a normal frontend project.

This is not a traditional PPT editor. Slides are React components, the browser is the preview/presentation surface, and markdown design guides define the visual direction.

The system must prioritize:

- simple project structure
- fast local preview
- AI-agent-friendly editing
- explicit design guide selection
- stable 16:9 slide rendering
- screenshot-based visual review
- minimal slide framework abstraction

## 2. Core Concept

The project consists of:

```txt
React source code       = slide source
Vite dev server         = live preview
Browser                 = slide viewer
Coding AI agent         = slide author/editor
designs/*.md            = selectable design guide gallery
Playwright screenshots  = visual feedback mechanism
Edit Inspect Mode       = element reference helper
```

The project should feel like a lightweight local replacement for React-based canvas-style slide creation, not like a full presentation editor.

## 3. Non-Goals

The initial implementation must not attempt to provide:

* PPTX compatibility
* WYSIWYG editing
* drag-and-drop editing
* visual design editor
* Figma/Canva-like manipulation
* a custom slide DSL
* a large slide component framework
* persistent selected-design state
* complex theme engine
* collaborative editing
* remote hosting workflow
* full presenter mode
* speaker notes
* automatic PDF export
* slide library integration such as Reveal.js, Spectacle, or Slidev

These may be considered later, but they must not shape the MVP architecture.

## 4. Technology Stack

The project must use:

* npm
* Vite
* React
* TypeScript
* Tailwind CSS

The project should include the following runtime/helper libraries by default:

* `lucide-react`
* `framer-motion`
* `recharts`
* `clsx`
* `tailwind-merge`
* `@fontsource/inter`
* `@fontsource/noto-sans-kr`

The project should include the following development dependencies for screenshot capture:

* `playwright`
* `tsx`

The project must not use pnpm or yarn in documentation, scripts, or examples.

## 5. Project Structure

The project must follow this structure unless there is a strong implementation reason to adjust it.

```txt
vibe-sliding/
  README.md
  README.ko.md
  SPEC.md
  AGENTS.md

  designs/
    minimal-dark.md
    executive-clean.md
    technical-grid.md
    startup-pitch.md

  skills/
    react-slide-authoring/
      SKILL.md
    design-guide-authoring/
      SKILL.md
      assets/
        design-guide-template.md
        design-guide-example.md

  src/
    main.tsx
    App.tsx
    slides.ts

    runtime/
      SlideStage.tsx
      useSlideNavigation.ts
      useStageScale.ts

    edit-mode/
      EditInspectMode.tsx
      elementReference.ts
      domPath.ts

    slides/
      001-title.tsx
      002-agenda.tsx
      003-content.tsx

    styles/
      global.css

  scripts/
    capture-slide.ts
    capture-all-slides.ts

  public/

  screenshots/
    .gitkeep

  package.json
  vite.config.ts
  tsconfig.json
  tailwind.config.ts
```

## 6. Script Requirements

`package.json` must provide at least the following scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "typecheck": "tsc --noEmit",
    "capture:slide": "tsx scripts/capture-slide.ts",
    "capture:all": "tsx scripts/capture-all-slides.ts"
  }
}
```

The screenshot scripts may assume the Vite dev server is already running.

The MVP does not need to automatically start and stop the dev server from the capture scripts.

## 7. Slide Runtime

The runtime must be intentionally small.

Required runtime features:

* render the current slide from `src/slides.ts`
* support left/right keyboard navigation
* support click-to-next-slide navigation
* support direct slide access with `?slide=N`
* support an end-of-slide-show screen after advancing beyond the final slide
* support edit inspect mode with `?edit=1`
* render slides inside a fixed 16:9 logical stage
* scale the stage to fit the current viewport
* prevent scrolling during normal presentation mode

The runtime must not introduce a heavy slide abstraction, slide DSL, or framework-like API.

The runtime must not render persistent slide chrome such as page numbers, progress bars, headers, footers, logos, or design-specific overlays on top of every slide. If a deck needs those elements, individual slide components should render them directly.

## 8. Slide Stage and Scaling

Slides must be rendered inside a fixed logical stage.

Default logical stage size:

```txt
1920 x 1080
```

The stage must always preserve a 16:9 ratio.

The browser viewport must not change the internal slide layout. Instead, the entire 1920x1080 stage must be scaled to fit the viewport.

Conceptual layout:

```txt
viewport
└── centered viewer background
    └── 1920x1080 stage, scaled to fit viewport
        └── current slide
```

Scaling rule:

```txt
scale = min(viewportWidth / 1920, viewportHeight / 1080)
```

The stage should be centered both horizontally and vertically.

The viewer background may fill the remaining space.

The slide itself must not be treated as a responsive webpage whose width changes with the browser. This is important because changing the layout width can cause different line breaks, chart sizes, and grid behavior across monitors.

The screenshot capture system must use the same 1920x1080 logical size.

## 9. Slide File Rules

Slides are plain React components.

Each slide must live under:

```txt
src/slides/
```

Each slide file must default-export a React component.

Example file names:

```txt
001-title.tsx
002-agenda.tsx
003-architecture.tsx
004-roadmap.tsx
```

The file numbering should reflect slide order.

A slide component should fill the available stage:

```txt
h-full w-full
```

A slide component may use direct JSX and Tailwind classes.

The project must not require slide authors to use custom components such as `SlideTitle`, `MetricCard`, `TwoColumn`, etc.

Small helper components may be added when useful, but the project must not evolve into a large slide component framework unless explicitly required.

## 10. Slide Registration

Slides must be registered manually in:

```txt
src/slides.ts
```

Manual registration is preferred for the MVP because it is explicit, easy for coding agents to modify, and easy to review in diffs.

Example structure:

```ts
import Slide001 from "./slides/001-title";
import Slide002 from "./slides/002-agenda";
import Slide003 from "./slides/003-content";

export const slides = [
  Slide001,
  Slide002,
  Slide003,
];
```

Automatic glob import may be considered later, but it is not part of the MVP.

## 11. Design Guide Gallery

The project must provide a design guide gallery under:

```txt
designs/
```

Each design guide is a markdown file.

The root project must not contain a single mandatory `DESIGN.md` that silently governs all work.

Instead, users must explicitly select a design guide for each new deck, new slide batch, or broad visual revision.

Example user intent:

```txt
Use designs/technical-grid.md.
Create a 6-slide presentation about the internal AI agent platform.
```

If the user does not select a design guide for new slide creation or broad visual changes, the coding agent should ask the user to choose one.

The project must not store selected design state in a config file.

Do not create files such as:

```txt
deck.config.json
selected-design.json
current-design.txt
```

Design choice is part of the current task instruction, not persistent project state.

For small text edits, typo fixes, bug fixes, or narrow corrections, the agent may preserve the existing visual style without asking for a design guide.

## 12. Design Guide Template

The project must include:

```txt
skills/design-guide-authoring/assets/design-guide-template.md
skills/design-guide-authoring/assets/design-guide-example.md
```

The design guide template and example are bundled assets of the design guide authoring skill, not user-selectable design guides. Files under `designs/` should be usable design guides.

Design guides should follow this structure:

```md
# Design Name

## Intended Use

Describe the audience, situation, and presentation type this design is best for.

## Visual Theme & Atmosphere

- Mood
- Energy level
- Visual density
- Formality

## Color Palette & Roles

| Role | Color | Usage |
|---|---:|---|
| Background | #000000 | Main slide background |
| Surface | #111111 | Cards and panels |
| Border | #333333 | Subtle outlines |
| Primary Text | #FFFFFF | Headings |
| Secondary Text | #AAAAAA | Body text |
| Accent | #00FFAA | Emphasis |

## Typography Rules

- Preferred fonts
- Title scale
- Body scale
- Caption scale
- Rules for monospace text

## Layout Principles

- 16:9 slide canvas
- Preferred composition
- Spacing rules
- Density rules
- How to handle diagrams, tables, and charts

## Visual Elements

- Cards
- Panels
- Lines
- Icons
- Diagrams
- Tables
- Code blocks
- Charts

## Motion

- Allowed animation style
- Motion restraint rules

## Do

- Concrete positive rules

## Don't

- Concrete anti-patterns

## Responsive Behavior

- Treat slides as a fixed 16:9 canvas.
- The viewer scales the canvas to the viewport.
- Do not design slides as vertically scrolling webpages.

## Agent Prompt Guide

Examples of prompts that work well with this design.
```

Design guides must be concrete enough for a coding AI agent to produce visually consistent slides.

Avoid vague-only guidance such as:

```txt
Make it beautiful.
Use modern design.
Make it professional.
```

Prefer concrete visual direction:

```txt
Use dark navy backgrounds, thin slate borders, emerald accent lines, compact technical cards, and grid-based layouts.
```

## 13. Built-In Design Guides

The MVP should include at least these design guides:

```txt
minimal-dark.md
executive-clean.md
technical-grid.md
startup-pitch.md
```

Each guide must be complete enough to be usable without additional explanation.

Recommended purposes:

### `minimal-dark.md`

For simple dark-mode presentations with strong typography and low visual clutter.

### `executive-clean.md`

For management-facing summaries, decision documents, proposals, and status reports.

### `technical-grid.md`

For developer-facing architecture, systems, API, runtime, infrastructure, or workflow explanations.

### `startup-pitch.md`

For product pitches, demos, vision decks, and more energetic presentations.

## 14. Edit Inspect Mode

The project must include Edit Inspect Mode from the MVP.

Edit Inspect Mode is not a WYSIWYG editor.

Its purpose is to help users precisely reference a visible slide element when asking a coding AI agent to modify it.

### 14.1 Activation

Edit Inspect Mode must be enabled by URL query:

```txt
?edit=1
```

Example:

```txt
http://localhost:5173/?slide=3&edit=1
```

The implementation may also support keyboard shortcuts:

```txt
E   toggle edit inspect mode
Esc disable edit inspect mode
```

Keyboard shortcuts are optional for MVP, but recommended.

### 14.2 Behavior

When Edit Inspect Mode is active:

* normal click-to-next-slide navigation must be disabled
* moving the cursor over slide content must highlight the element that would be selected
* the currently selectable element must be visually indicated in real time
* a compact floating label should describe the current target
* clicking an element must copy a one-line edit reference to the clipboard
* after copying, a small confirmation toast or indicator should appear

The experience should be similar to the browser developer tools element picker, but simplified for AI-assisted slide editing.

### 14.3 Hover Target Display

On hover, the UI should show:

* a visible outline around the target element
* a compact label near the element

Preferred label examples:

```txt
h1[data-ai-id=main-title]
```

```txt
div[data-ai-id=runtime-flow-card]
```

```txt
p "React 기반 슬라이드 생성"
```

The hover UI must not permanently alter the slide content.

### 14.4 Copied Reference Format

The copied edit reference must be one line.

It must be short enough to paste into a larger prompt.

The default format is a single grouped element reference:

```txt
@element(slide=3 file="src/slides/003-architecture.tsx" target="data-ai-id=runtime-flow-title" text="Agent Runtime Flow")
```

If `data-ai-id` is unavailable:

```txt
@element(slide=3 file="src/slides/003-architecture.tsx" target="h1" text="Agent Runtime Flow")
```

If the element has no visible text but has an accessible label:

```txt
@element(slide=3 file="src/slides/003-architecture.tsx" target="svg" label="flow arrow")
```

If neither text nor label is available, use a compact CSS path target:

```txt
@element(slide=3 file="src/slides/003-architecture.tsx" target="path:div[data-ai-id=principles].grid.grid-cols-2 > div.flex.items-center > svg.lucide > path" within="data-ai-id=principles")
```

Coordinate information must not be included by default.

Avoid multi-line copied references.

Avoid verbose prose.

Avoid multiple top-level `@slide`, `@file`, `@target`, and `@within` tokens for a single selected element because they can look like multiple independent references. Keep all fields grouped inside one `@element(...)` reference.

If a fallback path target is used and the selected element is inside a parent with `data-ai-id`, include `within="data-ai-id=..."` using the nearest ancestor that has `data-ai-id`. Do not add broad `within-text` fields by default because they can duplicate large text blocks and make references less clear.

### 14.5 Target Priority

When generating an edit reference target, use the following priority:

1. `data-ai-id`
2. visible text
3. `aria-label`
4. `alt`
5. tag name for clear text or label-bearing elements
6. anchored CSS path for low-level elements such as SVG paths or anonymous containers

Edit Inspect Mode should prefer the deepest visible element under the cursor for selection. This allows users to reference fine-grained elements when needed. If the copied reference would otherwise be ambiguous, the reference should add a CSS path target and nearest `data-ai-id` context.

DOM paths should be concise and anchored to a stable parent such as `data-ai-id` when available. Long unanchored DOM paths are brittle and less helpful for source-code editing.

## 15. `data-ai-id` Policy

`data-ai-id` is recommended, not mandatory.

Coding agents should add `data-ai-id` to major editable regions in complex slides.

Recommended targets:

* main title
* subtitle
* section heading
* key card
* important metric
* diagram block
* chart container
* callout
* primary image
* important label
* important group container

Rules:

* use kebab-case
* keep values short and meaningful
* avoid duplicate IDs within the same slide
* do not add `data-ai-id` to every small span or decorative element
* prefer semantic names over visual names

Good examples:

```txt
main-title
subtitle
runtime-flow-card
rate-limit-risk
architecture-runtime-layer
monthly-cost-chart
```

Bad examples:

```txt
blue-box
left-thing
text-1
div-3
big-card
```

## 16. Screenshot Capture

The project must support screenshot capture with Playwright.

Scripts:

```bash
npm run capture:slide -- 3
npm run capture:all
```

Output directory:

```txt
screenshots/
```

Output file examples:

```txt
screenshots/slide-001.png
screenshots/slide-002.png
screenshots/slide-003.png
```

Screenshot requirements:

* capture at 1920x1080
* use the same slide rendering path as the browser preview
* use `?slide=N` for direct slide access
* overwrite existing screenshot files for the same slide
* create `screenshots/` if it does not exist
* fail clearly if the dev server is not reachable
* wait briefly after page load before capturing so slide animations, charts, and font rendering can settle

The MVP may assume:

```txt
npm run dev
```

is already running.

The screenshot scripts do not need to start the dev server automatically.

The default settle wait may be configurable through an environment variable such as:

```bash
SLIDE_CAPTURE_SETTLE_MS=2000 npm run capture:slide -- 3
```

Slide components should not remove useful animations solely to make screenshots deterministic. Capture timing belongs in the screenshot script.

## 17. Visual Review Expectations

After visual slide changes, coding agents should capture screenshots and inspect them when possible.

Visual review should check:

* text overflow
* clipped content
* unreadably small text
* excessive bullet density
* poor spacing
* low contrast
* inconsistent alignment
* unintended scrolling
* visual mismatch with the selected design guide
* chart labels too small
* important content too close to edges
* hover/edit overlays not interfering with normal view

Slides should be optimized for presentation readability, not dense document reading.

## 18. Navigation Behavior

Required navigation:

* right arrow: next slide
* left arrow: previous slide
* space: next slide
* click: next slide
* direct URL access: `?slide=N`
* advancing past the final slide: show an end-of-slide-show screen

Recommended navigation:

* home: first slide
* end: last slide
* escape: exit edit inspect mode if active

Navigation must clamp to valid slide bounds.

Example:

* if the current slide is the first slide, previous slide keeps the user on the first slide
* if the current slide is the last slide, next slide opens the end-of-slide-show screen
* if the current view is the end-of-slide-show screen, previous slide returns to the final slide

The URL should update when the current slide changes.

The end-of-slide-show screen may be represented with:

```txt
?slide=end
```

The slide number should be 1-based in URLs and user-facing references.

Internal array indices may be 0-based.

## 19. Styling Rules

Tailwind CSS should be the default styling method.

Slide authors may use:

* direct JSX
* Tailwind utility classes
* installed visual libraries
* local helper components when useful

Slide authors should avoid:

* global CSS for slide-specific styling
* solving slide-specific visual problems in runtime or global CSS
* layout dependent on browser viewport width
* vertical scrolling
* tiny text
* excessive bullets
* overuse of animations
* adding heavy dependencies for one-off visuals

Global CSS should mainly define:

* font setup
* body reset
* neutral viewer base layout
* stage sizing and transform behavior
* utility behavior needed by runtime

Global CSS and runtime components should stay visually neutral. Slide-specific concerns such as page numbers, line-breaking rules, decorative backgrounds, card shadows, chart animation choices, and deck-specific layout polish should live in slide components unless they are required for the runtime itself.

## 20. Font Rules

The project should install and use:

* `@fontsource/inter`
* `@fontsource/noto-sans-kr`

Default font stack should support both English and Korean well.

Recommended global font family:

```txt
Inter, "Noto Sans KR", system-ui, sans-serif
```

Monospace should be reserved for:

* code
* shell commands
* IDs
* metrics
* technical identifiers

## 21. Asset Handling

When static assets are needed, place them under:

```txt
public/assets/
```

Create this directory only when assets are actually needed.

Slide files should reference assets using stable public paths.

Example:

```txt
/assets/diagram.png
```

The project should not require a complex asset pipeline in the MVP.

Coding agents should avoid embedding large base64 assets directly in slide source files.

## 22. AGENTS.md Requirements

The project must include `AGENTS.md`.

`AGENTS.md` is for coding AI agents.

It should summarize durable project rules.

It must include at least:

```md
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
```

## 23. Agent Skills

The project must include a `skills/` directory.

Skills must follow the Agent Skills directory format: each skill is a directory containing a required `SKILL.md` file with YAML frontmatter and Markdown instructions.

Required skills:

```txt
skills/react-slide-authoring/SKILL.md
skills/design-guide-authoring/SKILL.md
```

These files are procedural guidance, not runtime code.

Each `SKILL.md` must include at least:

```yaml
---
name: skill-name
description: Use this skill when ...
---
```

The `name` value must match the parent directory name, use lowercase letters and hyphens, and avoid leading, trailing, or consecutive hyphens. The `description` must explain both what the skill does and when the agent should use it.

### 23.1 `react-slide-authoring/SKILL.md`

This skill must cover:

* when to use the skill
* explicit design guide requirement
* slide creation workflow
* slide editing workflow
* screenshot review workflow
* edit inspect reference interpretation
* `data-ai-id` recommendations
* constraints against heavy abstractions

It should include this core guidance after Agent Skills frontmatter:

```md
# React Slide Authoring

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
3. aria-label or alt
4. tag name
5. anchored CSS path and nearest `data-ai-id` context
```

### 23.2 `design-guide-authoring/SKILL.md`

This skill must cover:

* creating new design guides
* revising existing design guides
* keeping guides concrete and reusable
* avoiding implementation-specific clutter
* using the required design guide sections

It should include this core guidance after Agent Skills frontmatter:

```md
# Design Guide Authoring

## Workflow

1. Understand the target mood, audience, and use case.
2. Create or edit a markdown file under `designs/`.
3. Keep the guide readable by AI coding agents.
4. Avoid overly abstract descriptions.
5. Include concrete color, typography, layout, and do/don't guidance.
6. Include an Agent Prompt Guide section.

## Required Sections

- Intended Use
- Visual Theme & Atmosphere
- Color Palette & Roles
- Typography Rules
- Layout Principles
- Visual Elements
- Motion
- Do
- Don't
- Responsive Behavior
- Agent Prompt Guide
```

## 24. README Requirements

The project must include a user-facing `README.md`.

`README.md` should be written in English. Korean documentation should live in a separate file such as `README.ko.md`, linked from the English README.

The README must explain:

* project purpose
* installation
* local development
* slide creation workflow
* design guide selection
* screenshot capture
* edit inspect mode
* adding a new design guide
* adding a new slide

The README must use npm commands only.

Minimum command examples:

```bash
npm install
npm run dev
npm run typecheck
npm run build
npm run capture:slide -- 3
npm run capture:all
```

The README must tell users that new slide creation and broad visual changes should explicitly choose a design file under `designs/`.

## 25. Example Slides

The project must include at least three example slides:

```txt
src/slides/001-title.tsx
src/slides/002-agenda.tsx
src/slides/003-content.tsx
```

The example slides should demonstrate:

* full-stage slide layout
* use of Tailwind
* use of `data-ai-id` on major elements
* at least one icon from `lucide-react`
* at least one simple chart or visual structure if reasonable
* Korean and English text rendering with the default fonts

The examples should be simple enough for users and coding agents to modify easily.

## 26. Dependency Policy

Default dependencies are allowed because they support common slide authoring needs.

New dependencies should be added only when:

* the user explicitly asks
* the dependency solves a recurring presentation need
* the benefit is clear
* the same result would be awkward with existing tools

Avoid adding heavy dependencies for a single slide.

Avoid dependencies that impose their own slide framework or presentation model.

## 27. Slide Library Policy

The MVP must not use external slide deck frameworks.

Do not use:

* Reveal.js
* `@revealjs/react`
* Spectacle
* Slidev
* Marp
* MDX Deck
* remark-based slide frameworks

The project should implement only the small amount of navigation and scaling behavior it needs.

This keeps the source structure simple and allows Edit Inspect Mode to work without framework interference.

Future versions may reconsider this if the project needs mature presenter tooling, fragments, speaker notes, PDF export, or overview mode.

## 28. Accessibility and Semantics

Slides should use reasonable semantic HTML where practical.

Recommended:

* use headings for main slide titles
* use lists for actual lists
* use `aria-label` for meaningful icons without text
* use `alt` for informative images
* avoid relying on color alone for meaning

This also improves Edit Inspect Mode references because `aria-label` and `alt` can be used as fallback identifiers.

## 29. Error Handling

The app should handle these cases gracefully:

### Invalid slide number

If `?slide=N` is invalid, clamp to the nearest valid slide.

Examples:

* `?slide=0` opens slide 1
* `?slide=999` opens the last slide
* non-numeric values open slide 1
* `?slide=end` opens the end-of-slide-show screen when slides exist

### No slides registered

Show a clear empty state telling the user to add slides under `src/slides/` and register them in `src/slides.ts`.

### Screenshot capture failure

If the capture script cannot reach the dev server, it should print a clear message such as:

```txt
Could not connect to http://localhost:5173.
Start the dev server with: npm run dev
```

### Clipboard failure

If Edit Inspect Mode cannot copy to clipboard, it should display the one-line reference on screen so the user can copy it manually.

## 30. Git Ignore Policy

The project should ignore generated screenshots.

Recommended `.gitignore` entries:

```gitignore
node_modules/
dist/
screenshots/*.png
```

The directory itself may be preserved with:

```txt
screenshots/.gitkeep
```

## 31. MVP Completion Criteria

The MVP is complete when all of the following are true:

* `npm install` works
* `npm run dev` starts the slide viewer
* slides render inside a fixed 1920x1080 logical stage
* the stage scales to fit the browser viewport
* `?slide=N` opens a specific slide
* keyboard navigation works
* click-to-next navigation works
* `?edit=1` enables Edit Inspect Mode
* hover in Edit Inspect Mode highlights the target element
* clicking in Edit Inspect Mode copies a one-line edit reference
* `npm run capture:slide -- 1` creates `screenshots/slide-001.png`
* `npm run capture:all` captures all registered slides
* `npm run typecheck` passes
* `npm run build` passes
* `skills/design-guide-authoring/assets/design-guide-template.md` exists
* `skills/design-guide-authoring/assets/design-guide-example.md` exists
* at least four usable design guides exist
* `AGENTS.md` exists
* required skill files exist
* at least three example slides exist

## 32. Future Extension Ideas

The following are explicitly future work, not MVP requirements:

* PDF export
* PPTX export
* presenter mode
* speaker notes
* slide thumbnail overview
* slide reorder helper
* screenshot diff
* visual regression testing
* design preview gallery
* preview images next to `designs/*.md`
* selected slide capture from the browser UI
* temporary dev server startup inside capture scripts
* automatic import of slide files
* asset cleanup helper
* more design guides
* optional diagram helpers
* optional Mermaid integration

## 33. Key Architectural Principle

The project must remain a lightweight React workspace.

Do not enforce slide quality through heavy code abstractions.

Instead, guide quality through:

* explicit design guide selection
* concrete markdown design guides
* simple slide file structure
* screenshot-based visual review
* Edit Inspect Mode references
* minimal but clear agent instructions

The intended workflow is:

```txt
agent creates slides
→ user previews in browser
→ user identifies issues visually
→ user uses edit inspect mode to reference elements
→ agent edits React code
→ screenshots verify the result
```

This is the core product loop.
