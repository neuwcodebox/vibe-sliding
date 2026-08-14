---
name: design-guide-authoring
description: Use this skill when selecting, creating, revising, auditing, or maintaining reusable slide themes and theme collections in designs/, including the project-owned basics collection and source-preserved external theme collections.
---

# Theme Collection Authoring

Curate the theme leaf that a React slide deck will follow. This skill owns the
catalog and reusable theme-collection contracts; `react-slide-authoring` owns
individual deck stories, slide components, and rendered slide QA.

## Triage the request

Read `AGENTS.md` and [`designs/README.md`](../../designs/README.md), then route
the work to the smallest correct artifact.

| Need | Correct action |
| --- | --- |
| An existing theme fits | Select that theme leaf; do not author another one |
| A complete upstream visual system fits | Select one source theme leaf; do not paraphrase it into a local theme |
| A durable direction is missing for future decks | Create one new basic theme at `designs/basics/themes/<name>.md` and index it |
| A basic theme is inaccurate or incomplete | Revise that leaf and its collection entry if needed |
| A one-off slide or deck issue | Preserve its current theme and use `react-slide-authoring` |
| Upstream template material needs refreshing | Update the pinned, source-preserving snapshot and provenance together |

For a new deck or broad redesign, choose one theme leaf. The collection is a
browsing scope, not an authority over the leaf. If the user explicitly asks for
help choosing, select the best-fitting leaf from the catalog and state it in the
handoff; if they neither choose nor delegate, ask before broad visual work.
Never write the choice to config.

## Choose a theme deliberately

Compare candidates against the actual deck rather than style adjectives alone:

- **Audience and occasion:** executive decision, technical walkthrough, product
  launch, workshop, handoff, or public talk.
- **Delivery mode and density:** speaker-led persuasion favors sparse focal
  slides; reading-first review can use denser evidence, comparisons, and
  annotations.
- **Formality and energy:** match the message's stakes without making a serious
  review look playful or a launch look inert.
- **Evidence shape:** choose a system that can carry the planned product UI,
  architecture, workflow, data, comparison, or decision—not just its cover.
- **Language and implementation:** translate type and layout to the fixed
  1920×1080 React stage with Inter and Noto Sans KR; reject a source rule that
  damages Korean/CJK readability or requires a foreign runtime.

Use `basics/` when a project-owned, repeatable theme fits. Use the source
collection when its existing grammar is already the right theme and does not
need to be copied or re-authored. These are maintenance choices, not a ranking
of visual authority.

## Browse the Beautiful HTML Templates collection progressively

The source-preserved collection lives at:

```txt
designs/beautiful-html-templates/
```

1. Read `index.json` to shortlist by mood, occasion, tone, formality, density,
   scheme, `best_for`, and `avoid_for`.
2. Read only shortlisted templates' `template.json` and `design.md`.
3. Select one template and use its visual grammar. Open `template.html` only
   when implementation needs a structural detail that the design documentation
   does not establish.

Do not bulk-read the collection or materialize each upstream theme as a local
Markdown theme. The selected source leaf is the theme; its demo copy, HTML
runtime, `deck-stage.js`, navigation, remote fonts, and viewport-fluid
measurements are not Vibe Sliding code. Preserve its license and provenance.

## Create or revise a Basics theme leaf

Use `assets/design-guide-template.md` as the working structure. Read
`assets/design-guide-example.md` when you need a calibration example. A Basics
theme should be a reusable visual contract, not an outline for one deck or a
list of vague style adjectives.

Build the guide in this order:

1. State the fit: audience, occasion, delivery mode, density, and formality.
2. Write one visual thesis that connects palette, type, surfaces, and energy.
3. Define implementation-ready tokens: color roles, type ranges, CJK fallback,
   gutter/grid behavior, panel geometry, borders, shadows, and emphasis.
4. Define composition and evidence grammar. Explain when to use a focal visual,
   flow, comparison, table, chart, or cards; cards must represent real groups or
   comparisons. Include a practical set of slide roles—cover, context,
   evidence/mechanism, comparison or decision, and close—inside the layout and
   visual-elements guidance so the system works beyond a title slide.
5. Define motion only where it reinforces reading order. State what is too busy,
   too dense, too decorative, or too small.
6. End with concise `Do`, `Don't`, and an Agent Prompt Guide that can be pasted
   into a future deck request.

Keep these required sections exactly once:

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

Guides should specify real evidence before decorative treatment, comfortable
presentation type before maximum content, and CJK-safe typography before
Latin-only stylistic rules. They must keep the stage fixed at 16:9 rather than
prescribing viewport-responsive or vertically scrolling layouts.

## Maintain collection boundaries

When adding or materially revising a Basics theme, update
`designs/basics/index.json` and `designs/README.md` only enough to keep the
collection entry and catalog structure accurate. Do not turn the README into a
second full copy of every theme.

When updating `designs/beautiful-html-templates`, work from a temporary upstream clone,
pin the exact commit in `UPSTREAM.md`, and replace the source payload as a
whole. Preserve `LICENSE`, `UPSTREAM.md`, `index.json`, and each included
template unchanged except for the provenance update. Do not edit an individual
vendored template to fit a particular deck, add upstream screenshots or clone
state, or use the source snapshot as a dependency.

## Validate and hand off

Before finishing a theme task, confirm that:

- the chosen theme leaf is unambiguous, not collection metadata, and lives under
  a `designs/` collection;
- a Basics theme is concrete, reusable, CJK-aware, stage-aware, and complete;
- its palette, hierarchy, grid, evidence, components, and motion describe one
  coherent visual system rather than a collection of trends;
- a source theme still has intact provenance and license files; and
- the handoff says which single leaf the slide author should read first.

Use `git diff --check` for documentation changes. Validate the skill structure
with the skill validator when this skill changes.

## Do not

- Create a Basics theme solely to duplicate an upstream theme's design notes.
- Make a theme depend on a slide framework, remote font, or runtime change.
- Store a selected theme in code or configuration.
- Prescribe CJK-hostile uppercase, tracking, or line-height without a
  script-specific alternative.
- Treat a theme as a substitute for the deck's narrative, evidence plan, or
  screenshot review.
