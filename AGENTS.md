# AGENTS.md

Vibe Sliding is a local React slide-deck workspace. Product behavior belongs in
`SPEC.md`; this file gives coding agents the durable working rules needed to
author, revise, and review decks well.

## Project boundaries

- This repository is both the runtime and a starter deck. Keep deck-specific
  content, visual systems, and motion under `src/slides/` whenever possible so
  downstream users can replace the demo without changing the runtime.
- Slides are plain React components. Vite is the preview and presentation
  surface; source files are the editing surface.
- Keep `src/runtime/`, `src/edit-mode/`, and `src/styles/global.css` generic.
  Do not solve one slide's layout or visual issue in the runtime or global CSS.
- Prefer direct JSX, Tailwind utilities, and existing dependencies over a slide
  DSL, a large component framework, or a new presentation library.
- Use npm, not pnpm or yarn.

```txt
src/
  slides/                  # deck-specific React slide components
  slides.ts                # explicit slide registry
  runtime/                 # generic stage, scale, and navigation behavior
  edit-mode/               # browser element-reference helpers
  styles/global.css        # app-wide font and runtime styling only
designs/
  README.md                # design-collection catalog and selection policy
  basics/                  # project-owned design systems
  beautiful-html-templates/  # source-preserved slide templates
  pptx-design-styles/      # source-preserved style references
skills/                    # procedural authoring guidance
scripts/                   # screenshot and export tooling
public/assets/             # stable browser assets when needed
```

## Design direction selection

Read [`designs/README.md`](designs/README.md) before creating a deck, a slide
batch, or a broad visual redesign. Its immediate child directories are peer
collections with different design levels. Choose one **design leaf**, not a
collection, as the deck's controlling direction:

- A `basics` index entry identifies a project-owned **design system**: it is a
  complete contract for hierarchy, composition, evidence, and motion.
- A `beautiful-html-templates` template directory is a source-preserved
  **slide template**: it also supplies repeatable slide structures to adapt.
- A `pptx-design-styles` index entry identifies a **style reference**: it
  supplies visual cues, but the deck's claims, evidence, and compositions must
  still be planned by the author.
- A user may name a leaf or explicitly delegate the choice. If neither occurs,
  ask before starting broad visual work. Collection README files, `index.json`,
  licenses, and provenance help with browsing; they are never selectable
  leaves.
- State the selected leaf and its design level in the handoff. Do not persist
  the choice in code or config.
- Do not blend two design leaves as co-equal systems. A narrow property from
  another collection is acceptable only when stated explicitly and the selected
  leaf remains in control.
- For a narrow edit, keep the current deck's design direction unless the user asks to
  change it.

Use the selected collection's local guide and metadata to locate its design
leaf. The upstream HTML, `deck-stage.js`, sample content, remote-font setup,
and navigation code from templates are never runtime code for this project. For
all external collections, adapt the selected design to the fixed 1920×1080
React stage, the installed Inter and Noto Sans KR stack, and the deck's real
content.

## Slide authoring method

1. **Classify the work.** Before creating, editing, or restyling slides, read
   the `kill-ai-slop` skill to avoid AI-default design patterns. For a de-slop
   request or broad visual review, follow that skill's workflow. Distinguish a
   new deck or broad redesign from an enhancement. Inspect `src/slides.ts`,
   the relevant components, and the selected theme before changing code.
2. **Plan the story before layout.** Identify audience, delivery mode, and the
   job of each slide. Speaker-led decks prioritize one idea, large type, and
   whitespace; reading-first decks may carry denser evidence, annotations, and
   comparisons. If the intended density does not fit, split or reorganize the
   material instead of shrinking it.
3. **Give every slide a claim and proof.** One memorable assertion should be
   obvious at presentation size. Support it with real product UI, source
   structure, a browser result, a diagram, a workflow, or accurately sourced
   data whenever possible. Do not invent metrics, charts, or before/after
   claims as decoration.
4. **Use one grammar across the deck.** Keep typography roles, palette,
   gutters/grid, surface treatment, emphasis, charts, and motion coherent.
   Do not default to repeated equal-weight cards: use cards for genuine groups
   or comparisons, and use a focal visual, process, or asymmetric composition
   when it better carries the message.
5. **Implement for the stage.** Slide roots fill `h-full w-full`; all content
   stays inside the fixed 1920×1080 / 16:9 stage. Do not depend on viewport
   reflow or vertical scrolling. Use the installed Inter and Noto Sans KR font
   stack; avoid Latin-only uppercase and aggressive negative tracking for CJK
   text. Add stable, kebab-case `data-ai-id` values to major editable regions.
6. **Review the rendered result.** After visual work, capture the affected
   slide or deck when possible. Inspect for clipping, text overflow, overlap,
   edge safety, hierarchy, contrast, readable type, CJK line breaks, and
   consistency with the selected theme. Iterate on the slide component.

## File and code conventions

- Name slide files with a three-digit prefix and kebab-case topic, such as
  `src/slides/004-agent-flow.tsx`; default component names use matching Pascal
  case, such as `Slide004AgentFlow`.
- Register slides explicitly and in order in `src/slides.ts`; keep each `file`
  field aligned with the source path.
- Put reusable demo-only helpers in a clearly named `src/slides/_shared/`
  subfolder, never among the numbered slide files.
- `data-ai-id` names describe editable meaning (`main-title`, `cost-chart`),
  not appearance (`blue-box`).
- Use `public/assets/` for static assets requiring stable browser URLs. Do not
  embed large base64 data in slide source.
- Keep comments sparse and useful. Prefer descriptive local names to
  abbreviations.

## Runtime and edit inspect

- Treat `SPEC.md` as the source of truth for stage scaling, navigation, exports,
  and Edit Inspect Mode.
- Keep navigation, scaling, stage rendering, and element-reference logic in
  their existing module boundaries.
- When an edit reference is supplied, match it in this order: `data-ai-id`,
  visible text, `aria-label`/`alt`, tag, then the anchored CSS path with its
  nearest `data-ai-id` context.
- Browser scaling affects hit testing. Verify browser behavior when modifying
  edit inspect or coordinate-sensitive code.

## Commands and verification

- Install: `npm install`
- Preview: `npm run dev`
- Typecheck: `npm run typecheck`
- Build: `npm run build`
- Lint: `npm run lint`
- Capture one slide: `npm run capture:slide -- N`
- Capture the deck: `npm run capture:all`
- Refresh the checked-in demo grid: `npm run capture:demo-grid` (after `capture:all`)
- Export image-based PPTX: `npm run export:pptx`
- Export experimental editable PPTX: `npm run export:pptx:editable`

Run the narrowest check that provides confidence. TypeScript or runtime work
needs `npm run typecheck` at minimum; visual slide work needs relevant capture
and inspection when a dev server is available; PPTX work needs the affected
export. For documentation-only changes, run `git diff --check`.

## Git workflow

- Preserve unrelated changes in a dirty worktree.
- Use conventional, imperative commit subjects when committing, for example
  `feat: add slide capture shortcut` or `fix: preserve scaled hit target`.
