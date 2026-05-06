# Editorial Data Brief

## Intended Use

Use this design for strategy updates, research summaries, and executive briefings where the audience needs to scan evidence, compare options, and remember one or two key points per slide.

## Visual Theme & Atmosphere

- Mood: calm, analytical, editorial
- Energy level: moderate
- Visual density: medium-high, with clear hierarchy
- Formality: business formal without feeling like a default corporate template

## Color Palette & Roles

| Role | Color | Usage |
|---|---:|---|
| Background | #F7F4EE | Main slide background |
| Surface | #FFFFFF | Tables, charts, and callout panels |
| Border | #D8D0C4 | Subtle dividers and chart rules |
| Primary Text | #171717 | Headlines and key metrics |
| Secondary Text | #5F5A52 | Body copy and labels |
| Accent | #1F6F68 | Primary emphasis, active chart series |
| Warning Accent | #B4532A | Risk, decline, or caution highlights |

## Typography Rules

- Preferred fonts: Inter for Latin text, Noto Sans KR for Korean text
- Title scale: 72-104px, semibold, tight line-height
- Body scale: 28-38px, regular or medium
- Caption scale: 20-24px, medium, muted color
- Rules for monospace text: use only for IDs, code labels, or short data keys; keep it below 28px

## Layout Principles

- Use a fixed 16:9 slide canvas with generous outer margins around 96-128px.
- Prefer two-zone layouts: a strong narrative column on the left and evidence on the right, or a full-width evidence layout with a compact title band.
- Keep dense slides organized with thin dividers, aligned baselines, and repeated column widths.
- Charts should have direct labels when possible instead of relying on legends.
- Tables should show only the columns needed for the slide's argument.

## Visual Elements

- Cards: use square or lightly rounded rectangles, 0-8px radius, white surface, thin border
- Panels: use for grouped evidence, not for every paragraph
- Lines: use 1-2px dividers in #D8D0C4
- Icons: use small lucide icons as labels or status markers, not decoration
- Diagrams: favor simple node-and-arrow flows with restrained color
- Tables: use large row height, muted headers, and one accent column
- Code blocks: avoid unless the deck is technical; use muted surface and monospace labels
- Charts: use low-saturation fills, strong axis labels, and one accent series

## Motion

- Allowed animation style: short fade or upward reveal for title, then evidence groups
- Motion restraint rules: avoid staggered animations on dense tables; do not animate chart axes independently

## Do

- Use one strong sentence headline per slide.
- Show the most important number in the largest type.
- Align chart labels and table columns precisely.
- Use accent color to explain the message, not just to decorate.

## Don't

- Do not use gradient blobs, oversized hero imagery, or decorative illustrations.
- Do not center-align dense analytical content.
- Do not put every content group in a card.
- Do not use more than two accent colors on one slide.

## Responsive Behavior

- Treat slides as a fixed 16:9 canvas.
- The viewer scales the canvas to the viewport.
- Do not design slides as vertically scrolling webpages.

## Agent Prompt Guide

Use `designs/editorial-data-brief.md` for a concise executive briefing. Favor dense but readable layouts, editorial hierarchy, muted warm background, precise tables/charts, and teal accent highlights.
