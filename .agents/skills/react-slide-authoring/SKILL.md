---
name: react-slide-authoring
description: Use this skill when creating, editing, restyling, reviewing, or debugging React slides in this workspace, including screenshot/layout feedback, Edit Inspect references, files under src/slides, and requests for a new or substantially redesigned deck.
---

# React Slide Authoring

Create presentation-ready React slides from a chosen theme leaf. This
skill owns the deck story, slide components, targeted revisions, and rendered
quality review. It does not create a new theme leaf unless the task is
explicitly routed to `design-guide-authoring`.

## Start with the right scope

Read `AGENTS.md`, then classify the task before changing code.

| Request | Design action | First context to inspect |
| --- | --- | --- |
| Copy, alignment, overflow, or a narrow visual repair | Preserve the deck's current theme | Referenced slide and nearby components |
| New deck, new slide batch, or broad restyle | Require a named theme leaf or explicit delegated selection | `designs/README.md`, selected collection and leaf, `src/slides.ts` |
| User delegates theme selection | Select and state one theme leaf, then use it for the task | `designs/README.md` |
| New reusable theme is needed | Hand off to `design-guide-authoring` | Existing themes and catalog |

Do not write a selected theme into code or config. For a broad change, two
theme leaves cannot be co-equal systems. Pick one; if another source helps,
limit it to one named property without changing the chosen theme's hierarchy,
palette, grid, or surface grammar.

Treat an explicit user delegation such as “choose the best theme” as permission
to select and state one leaf. If the user neither names a leaf nor delegates the
choice, ask before broad visual work. `README.md`, `index.json`, licenses, and
provenance files are browsing metadata, not selectable leaves.

## Plan before JSX

Before filling panels or writing copy, make a compact deck plan:

1. Identify the audience, decision or action, delivery mode, and required
   artifacts. Live talks and persuasive demos are usually speaker-led; async
   reviews and handoffs are usually reading-first.
2. Give every slide a narrative role and one memorable claim. A good sequence
   introduces the promise or problem, establishes context, shows evidence or
   mechanism, resolves the implication, and closes with the next action.
3. Assign evidence before choosing the layout: product UI, real output, source
   structure, an accurately sourced datum, a diagram, a workflow, or a useful
   comparison. Do not fabricate metrics or charts as visual filler.
4. Choose density deliberately. A speaker-led slide usually needs one large
   idea and one to three supports; a reading-first slide can carry a diagram,
   comparison, annotations, or a compact table if it remains scannable. Split
   material rather than shrinking it into unreadability.

Use [`references/slide-quality-rubric.md`](references/slide-quality-rubric.md)
when a deck is new, substantial, or hard to simplify. It provides the planning
ledger and rendered-review checklist without turning this skill into a slide
framework.

## Consume one theme leaf

### Vibe Sliding Basics leaf

Read `designs/basics/README.md` and the selected `<theme>.md` leaf listed
there completely. Translate its visual thesis, tokens, typography, density,
component grammar, and motion limits into the deck. A theme is a reusable
visual contract, not a prompt to make every slide look like the same card grid.

### Beautiful HTML Templates leaf

Use [`designs/README.md`](../../designs/README.md) and read the vendored
library progressively:

1. Read `designs/beautiful-html-templates/index.json` to shortlist
   against the audience, occasion, formality, density, scheme, `best_for`, and
   `avoid_for` fields.
2. Read `template.json` and `design.md` only for shortlisted candidates.
3. Once one template is selected, use its `design.md` and metadata as the
   visual grammar. Read its `template.html` only when a layout mechanism cannot
   be inferred otherwise.

Translate rather than import. The HTML, `deck-stage.js`, sample copy,
navigation, remote-font setup, and viewport-fluid values are upstream reference
material. Keep Vibe Sliding's fixed 1920×1080 React stage, installed fonts, and
real deck content. Never expose template names, source paths, or selection
notes in rendered slides.

For Korean or other CJK copy, keep normal tracking, adequate line-height, and
the installed Noto Sans KR fallback. Do not blindly carry over Latin-only
uppercase, narrow condensed faces, or negative letter-spacing from a template.

## Build the deck

- Inspect `src/slides.ts` and relevant slide files before editing. Keep
  slide-specific layout, typography, visuals, and motion in `src/slides/`;
  keep runtime code visually neutral and generic.
- Use plain React, TypeScript-friendly JSX, and Tailwind utilities. Slide roots
  fill `h-full w-full`, and the entire composition must fit the fixed 16:9
  stage—never a responsive, scrolling webpage.
- Keep one visual grammar across the deck: typography roles, grid and gutters,
  palette, surface treatment, emphasis, chart treatment, and motion. Use cards
  only for actual groups or comparisons; use an evidence region, flow,
  comparison, timeline, or asymmetry when it better expresses the claim.
- Use real visual evidence at the scale where the audience can understand it.
  Labels and decoration must support the claim, not compete with it.
- Use `data-ai-id` on major editable regions such as titles, key evidence,
  charts, callouts, or group containers. Keep values meaningful and kebab-case;
  avoid IDs for every decorative span.
- Reuse existing dependencies before adding one: Lucide for icons,
  Framer Motion for restrained sequencing, Recharts for data charts, and
  `MermaidDiagram` for Mermaid diagrams. Do not add a presentation framework,
  slide DSL, remote font, or one-off heavy visualization library without need.

## Apply targeted revisions

An Edit Inspect reference identifies a visible target, not an instruction to
change runtime behavior. Resolve it in this order:

1. `data-ai-id`
2. visible text
3. `aria-label` or `alt`
4. tag name
5. anchored CSS path plus its nearest `data-ai-id` context

Change the smallest relevant JSX region, then consider whether the same visual
problem affects an intentional shared helper. Do not move a one-slide workaround
to global CSS or the runtime. Browser stage scaling affects hit testing, so
verify Edit Inspect changes in a real browser.

## Verify the rendered slide

For visual work, capture the affected slide or deck when a dev server is
available. Inspect at presentation size, not only in source:

- no text clipping, overflow, unintended wrapping, or content outside the safe
  frame;
- no overlap among panels, labels, diagrams, decorative elements, or captures;
- a clearly dominant claim, readable support, and enough contrast;
- usable density, gutters, edge safety, and CJK line breaks;
- consistent visual grammar across adjacent slides; and
- no Edit Inspect overlay in normal presentation mode.

Iterate on the slide component until the issue is resolved. Run the narrowest
relevant validation in `AGENTS.md`; source or runtime changes need typecheck at
minimum, and visual changes need a screenshot review when possible.

## Do not

- Import an upstream template's runtime, sample content, or font setup.
- Combine unrelated themes slide by slide, or create a duplicate local theme
  leaf just to paraphrase a selected source theme.
- Fill space with fabricated metrics, decorative dashboards, excessive bullets,
  or repeated equal-weight cards.
- Solve a local visual defect through `src/runtime/` or global CSS.
- Shrink text below comfortable presentation size to avoid splitting a slide.
- Remove useful motion solely to make a capture deterministic; adjust capture
  settling when timing is the real issue.
