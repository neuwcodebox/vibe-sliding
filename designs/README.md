# Theme Collections

`designs/` is the catalog of reusable slide themes. Its immediate child
directories are peer collections, not a hierarchy of local guides above
external themes. This file is catalog metadata, not a theme that can be
selected for a deck.

| Collection | Theme leaves | Browse with | Maintenance model |
| --- | --- | --- | --- |
| [`basics/`](basics/README.md) | A `<theme>.md` file listed in its README | Its collection README | Project-owned and editable |
| [`beautiful-html-templates/`](beautiful-html-templates/) | `templates/<theme>/` | Its `index.json` | Source-preserved MIT snapshot |

## Select a theme leaf

For a new deck, a slide batch, or a broad redesign, select one **theme leaf**
from one collection. A collection itself is only a browsing scope; it is not a
deck direction. The choice lives in the task, never in code or configuration.

The user can either name a leaf or explicitly delegate the choice to the agent.
If neither happens, ask for a theme before broad visual work. Collection
README files, `index.json`, licenses, and provenance files help with browsing;
they are not selectable leaves.

```txt
Use designs/basics/technical-grid.md as the theme. Create a 6-slide API architecture review for engineering leaders.
```

```txt
Use designs/beautiful-html-templates/templates/cobalt-grid/ as the theme. Create a 5-slide developer-tool launch deck with Korean and English labels.
```

Do not combine two themes as co-equal systems. If another theme is useful for a
single, narrow property, state that property and keep the selected leaf in
control. For a copy edit, layout correction, or other narrow revision, preserve
the deck's current theme instead of selecting a new one.

## Browse a collection appropriately

### Vibe Sliding Basics

Read [`basics/README.md`](basics/README.md), then the selected Markdown theme.
These themes are maintained in this repository and can be revised or extended
when a reusable project direction is genuinely missing.

### Beautiful HTML Templates

Read [`beautiful-html-templates/index.json`](beautiful-html-templates/index.json)
to shortlist by mood, occasion, formality, density, scheme, `best_for`, and
`avoid_for`. Read `template.json` and `design.md` only for shortlisted
candidates. Once selected, use that one template's visual grammar and open
`template.html` only when a React implementation needs a structural detail.

The collection is a source-preserving MIT snapshot of
[`zarazhangrui/beautiful-html-templates`](https://github.com/zarazhangrui/beautiful-html-templates).
Its provenance, scope, and update procedure live in
[`UPSTREAM.md`](beautiful-html-templates/UPSTREAM.md). Translate a selected
template into the fixed 1920×1080 React stage with the installed font stack and
real deck content. Do not import its HTML, `deck-stage.js`, sample copy,
remote-font setup, or navigation runtime.

## Maintain collections without changing their rank

Add a new project-owned theme under `basics/` only when a distinct direction
will be reused across future decks. Do not recreate an upstream theme as a local
Markdown file merely to make it easier to select.

Update `beautiful-html-templates/` as one source-preserving snapshot, including
its license and provenance, rather than editing individual upstream themes for a
specific deck. The different maintenance methods do not make either collection
more authoritative at deck-selection time.
