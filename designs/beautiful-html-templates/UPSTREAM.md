# Upstream provenance

- Source: <https://github.com/zarazhangrui/beautiful-html-templates>
- Snapshot commit: `e5e204fb1f3b06290846e7dcd7aceddabeceec8c` (`2026-06-09`)
- Upstream license: MIT; see the adjacent [LICENSE](./LICENSE).
- Retrieved for this repository: `2026-08-03`.

## Included scope

This is a vendored, source-preserving design-template snapshot. It contains the
upstream selection index (`index.json`) and all 34 template folders under
`templates/`. Each template carries its original `design.md`, `template.html`,
and `template.json`; the ten templates that ship a local `deck-stage.js` retain
that file as well.

The catalog at [`../README.md`](../README.md) explains how this collection fits
alongside the other theme collections. Use the index to shortlist a visual
system, then read the selected template's metadata and design guide; open its
HTML only when a React implementation needs a structural detail. A selected
template may be the theme for a deck, but its files never replace Vibe Sliding's
plain React components or fixed-stage runtime.

## Deliberately excluded

- `screenshots/` (upstream gallery captures; about 32 MiB)
- `.git/`, `node_modules/`, and other clone state
- upstream `README.md`, `AGENTS.md`, `runtime/`, and `scripts/`

These exclusions keep the vendored payload focused on visual systems and their
selection metadata. The upstream files included here are copied without content
changes.

## Selection-index note

The copied upstream `index.json` has 34 entries matching the 34 template
folders. One upstream metadata discrepancy is intentionally preserved:
`pink-script` names `Instrument Serif` in the index tagline but `DM Serif
Display` in its `template.json`. Prefer the selected template's local
`template.json` and `design.md` when they disagree with the index.

## Updating

When updating this snapshot, clone the source repository to a temporary path,
pin the new commit above, replace only `index.json`, `templates/`, and
`LICENSE`, and update this file. Do not add upstream screenshots or clone
metadata unless there is a specific product need.
