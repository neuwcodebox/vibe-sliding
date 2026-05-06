# Minimal Dark

## Intended Use

Use this guide for focused technical explainers, concise product updates, internal reviews, and talks where the message should feel calm and uncluttered.

## Visual Theme & Atmosphere

- Mood: quiet, confident, precise
- Energy level: low to medium
- Visual density: sparse, with one dominant idea per slide
- Formality: professional but not corporate-heavy

## Color Palette & Roles

| Role | Color | Usage |
|---|---:|---|
| Background | #07090F | Main slide background |
| Surface | #101827 | Simple panels and cards |
| Border | #263244 | Thin dividers and card outlines |
| Primary Text | #F8FAFC | Titles and key numbers |
| Secondary Text | #CBD5E1 | Body copy |
| Muted Text | #64748B | Captions, labels, metadata |
| Accent | #5EEAD4 | Highlights, rules, key labels |
| Warning | #FBBF24 | Rare caution indicators |

## Typography Rules

- Use Inter and Noto Sans KR.
- Titles: 76-118px, semibold, tight line height.
- Body: 28-38px, regular or medium.
- Captions: 18-24px, muted.
- Monospace only for commands, IDs, file paths, and metrics.

## Layout Principles

- Use large margins: 88-128px.
- Prefer one large text block plus one supporting visual.
- Keep cards rectangular with subtle borders and no heavy shadows.
- Use grid alignment and generous whitespace.
- Charts should use few labels and a single accent series.

## Visual Elements

- Cards: flat, dark surface, 1px border.
- Panels: use only when grouping related content.
- Lines: thin teal or slate rules.
- Icons: lucide icons at 28-48px, one accent color.
- Diagrams: simple boxes and arrows, never crowded.
- Tables: only 3-5 columns, large row height.
- Code blocks: dark surface with muted syntax-like contrast.
- Charts: sparse axes, large labels, no decorative legends.

## Motion

- Use subtle fade or y-axis entrance only.
- Keep animation under 600ms.
- Do not animate every bullet.

## Do

- Use a single strong headline.
- Use teal accent sparingly.
- Add `data-ai-id` to major editable regions.
- Keep Korean and English text at readable sizes.

## Don't

- Do not use dense bullet lists.
- Do not add gradients as the main visual system.
- Do not use tiny labels below 18px.
- Do not create nested cards.

## Responsive Behavior

- Treat slides as a fixed 16:9 canvas.
- The viewer scales the canvas to the viewport.
- Do not design slides as vertically scrolling webpages.

## Agent Prompt Guide

- "Use designs/minimal-dark.md. Create a 4-slide overview of our AI runtime."
- "Use the minimal dark guide and revise slide 2 to focus on one decision."
