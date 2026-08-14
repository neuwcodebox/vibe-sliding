# Design Collections

`designs/` is a catalog of reusable design inputs for slide decks. They do not
all operate at the same level: some define a reusable design system, some carry
complete slide-template structures, and some provide a visual style direction.
Its immediate child directories are peer collections; this file is catalog
metadata, not a design direction that can be selected for a deck.

| Collection | Selectable leaf | Design level | What it gives you |
| --- | --- | --- | --- |
| [`basics/`](basics/README.md) | `themes/<theme>.md` listed in `index.json` | Design system | Reusable rules for hierarchy, layout, evidence, motion, and fixed-stage implementation. |
| [`beautiful-html-templates/`](beautiful-html-templates/) | `templates/<theme>/` | Slide template | A complete visual grammar with proven slide structures to adapt into React. |
| [`pptx-design-styles/`](pptx-design-styles/) | A file in `styles/` listed in `index.json` | Style reference | Palette, type, layout cues, and signature elements; the deck structure still needs to be authored. |

## Select one controlling direction

For a new deck, a slide batch, or a broad redesign, select one **design leaf**
from one collection. A collection is only a browsing scope; it is not a deck
direction. The choice lives in the task, never in code or configuration.

The user can either name a leaf or explicitly delegate the choice to the agent.
If neither happens, ask for a theme before broad visual work. Collection README
files, `index.json`, licenses, and provenance files help with browsing; they are
not selectable leaves.

```txt
Use designs/basics/themes/technical-grid.md as the theme. Create a 6-slide API architecture review for engineering leaders.
```

```txt
Use designs/beautiful-html-templates/templates/cobalt-grid/ as the theme. Create a 5-slide developer-tool launch deck with Korean and English labels.
```

Do not combine two themes as co-equal systems. If another collection is useful
for a single, narrow property, state that property and keep the selected leaf in
control. For a copy edit, layout correction, or other narrow revision, preserve
the deck's current theme instead of selecting a new one.

## Browse a collection appropriately

### Vibe Sliding Basics — design systems

Read [`basics/index.json`](basics/index.json) to shortlist, then the selected
Markdown theme under `themes/`. A Basics leaf is a complete design-system
contract, so use it directly for the deck's visual and compositional decisions.
These themes are maintained in this repository and can be revised or extended
when a reusable project direction is genuinely missing.

### Beautiful HTML Templates — slide templates

Read [`beautiful-html-templates/index.json`](beautiful-html-templates/index.json)
to shortlist by mood, occasion, formality, density, scheme, `best_for`, and
`avoid_for`. Read `template.json` and `design.md` only for shortlisted
candidates. Once selected, use that one template's visual grammar and open
`template.html` only when a React implementation needs a structural detail.

A template supplies repeatable slide structures as well as visual rules. Adapt
those structures to the deck's actual story and evidence; do not import its
HTML runtime, sample copy, or navigation behavior.

The collection is a source-preserving MIT snapshot of
[`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates).
Its provenance, scope, and update procedure live in
[`UPSTREAM.md`](beautiful-html-templates/UPSTREAM.md). Translate a selected
template into the fixed 1920×1080 React stage with the installed font stack and
real deck content. Do not import its HTML, `deck-stage.js`, sample copy,
remote-font setup, or navigation runtime.

### PPTX Design Styles — style references

Read [`pptx-design-styles/index.json`](pptx-design-styles/index.json) to find a
candidate, then read just its corresponding file in `styles/`. The full
upstream reference is not stored locally. Details of the pinned source,
license declaration, and refresh procedure are in
[`pptx-design-styles/UPSTREAM.md`](pptx-design-styles/UPSTREAM.md).

A style reference gives an aesthetic direction, not a slide outline or a
component inventory. After selecting one, plan the deck's claims, evidence, and
compositions before applying its visual cues. Do not treat it as a second
co-equal system beside a selected Basics theme or HTML template.

## Maintain collections without changing their rank

Add a new project-owned theme under `basics/` only when a distinct direction
will be reused across future decks. Do not recreate an upstream theme as a local
Markdown file merely to make it easier to select.

Update `beautiful-html-templates/` as one source-preserving snapshot, including
its license and provenance, rather than editing individual upstream themes for a
specific deck. Update `pptx-design-styles/` as its 30-section reference
snapshot and preserve its upstream license declaration and provenance. The
different maintenance methods do not make one collection more authoritative at
deck-selection time.
