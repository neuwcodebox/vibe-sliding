# Slide Quality Rubric

Use this reference to plan a new deck, review a substantial redesign, or
diagnose why a slide is technically valid but not presentation-ready.

## Deck planning ledger

Before implementation, write a short line for each slide:

| Field | Question to answer |
| --- | --- |
| Audience and action | Who is viewing it, and what should they understand, decide, or do? |
| Delivery mode | Is it speaker-led or reading-first? |
| Narrative role | Does it promise, frame, explain, prove, compare, decide, or close? |
| Primary claim | What should the viewer remember after three seconds? |
| Evidence | What real artifact, UI, data, diagram, process, or comparison earns the space? |
| Composition | What focal arrangement makes the claim obvious? |
| Density | What is the minimum content required for this audience and mode? |

If a slide has no clear claim or evidence, merge it, remove it, or redefine its
job before polishing its appearance.

## Composition tests

- The claim should be the first thing a viewer sees at presentation size.
- Use a visible hierarchy: claim, evidence, support, then metadata. Equal-sized
  regions should mean equal importance, not merely convenient layout.
- Put the strongest proof at a useful size. A tiny screenshot, unlabeled chart,
  or decorative diagram is not evidence.
- Let the composition follow the narrative: a flow for sequence, a comparison
  for trade-offs, a table for exact scanning, a focal image for product proof,
  and cards only for real grouped entities.
- Keep safe margins and intentional negative space. Empty space should clarify
  hierarchy, not arise from abandoned areas of a grid.
- When content becomes dense, simplify the argument or split the slide instead
  of reducing every type size.

## System consistency tests

- Use one chosen direction's typography roles, palette, gutters, surfaces,
  borders, emphasis, chart grammar, and motion language across the deck.
- Vary composition by slide role without introducing unrelated themes.
- Prefer real artifacts over generic icon-card dashboards and invented
  quantitative claims.
- Translate external templates to the fixed React stage and installed font
  stack; do not copy their runtime assumptions or sample content.
- For mixed Korean/Latin content, inspect actual line wrapping, tracking, and
  line height rather than assuming a Latin-first type system will transfer.

## Rendered review checklist

Capture the real 1920×1080 stage and inspect every affected slide for:

1. **Bounds:** no clipping, overflow, accidental viewport reflow, or content
   pressed against the edge.
2. **Collisions:** no panels, labels, rules, images, chart annotations, or
   decoration overlapping unintentionally.
3. **Legibility:** title, body, caption, code, and chart labels are readable at
   presentation size with sufficient contrast.
4. **Hierarchy:** the main claim is immediate; secondary information supports
   it rather than competing for attention.
5. **Evidence:** product captures, diagrams, tables, and charts are large
   enough to carry their stated argument and accurately labeled.
6. **Rhythm:** adjacent slides feel like one deck while their composition is
   appropriate to their distinct narrative roles.
7. **Interaction:** normal view has no inspection artifacts, and any relevant
   edit-reference behavior still works under stage scaling.

Record the visual defect in terms of its cause—content density, hierarchy,
geometry, contrast, or system inconsistency—then change the smallest slide-local
implementation that fixes it.
