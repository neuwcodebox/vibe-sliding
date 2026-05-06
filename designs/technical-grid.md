# Technical Grid

## Intended Use

Use this guide for architecture reviews, API explanations, infrastructure plans, runtime diagrams, developer onboarding, and systems walkthroughs.

## Visual Theme & Atmosphere

- Mood: analytical, structured, implementation-aware
- Energy level: medium
- Visual density: moderate to high, but organized
- Formality: technical professional

## Color Palette & Roles

| Role | Color | Usage |
|---|---:|---|
| Background | #0B1020 | Main slide background |
| Surface | #111827 | Cards, nodes, code panels |
| Surface Alt | #172033 | Secondary panels |
| Border | #334155 | Grid lines and box outlines |
| Primary Text | #F8FAFC | Headings and labels |
| Secondary Text | #CBD5E1 | Body text |
| Muted Text | #94A3B8 | Captions and metadata |
| Accent | #5EEAD4 | Active paths and key nodes |
| Secondary Accent | #93C5FD | Supporting paths and categories |

## Typography Rules

- Use Inter and Noto Sans KR.
- Titles: 72-96px, semibold.
- Diagram labels: 24-34px.
- Body: 24-30px.
- Captions: 18-22px.
- Monospace for file paths, endpoint names, commands, and code.

## Layout Principles

- Build on visible or implied grid alignment.
- Prefer 2-column layouts, architecture lanes, flow rows, and matrix diagrams.
- Use consistent node sizes within a single diagram.
- Keep edge margins at least 72px.
- Reserve one area for context and one area for the diagram or chart.

## Visual Elements

- Cards: dark surface, thin slate border, square or 6px radius max.
- Panels: use for code, logs, config, or grouped architecture layers.
- Lines: straight connectors; avoid tangled arrows.
- Icons: lucide icons paired with labels for key system roles.
- Diagrams: include labels directly inside nodes.
- Tables: compact but readable, no more than 6 rows if possible.
- Code blocks: monospace, large enough to read from a presentation view.
- Charts: technical metrics with clear axes and direct annotations.

## Motion

- Use motion only to reveal flow direction or highlight the current layer.
- Avoid looping animations.

## Do

- Add `data-ai-id` to important diagram nodes and labels.
- Use file paths and commands exactly when they help orientation.
- Keep alignment strict.
- Use concise labels instead of paragraphs inside diagrams.

## Don't

- Do not create a framework of custom slide components.
- Do not draw complicated architecture spaghetti.
- Do not shrink text to fit too many boxes.
- Do not use decorative backgrounds that compete with diagrams.

## Responsive Behavior

- Treat slides as a fixed 16:9 canvas.
- The viewer scales the canvas to the viewport.
- Do not design slides as vertically scrolling webpages.

## Agent Prompt Guide

- "Use designs/technical-grid.md. Create slides explaining the agent runtime architecture."
- "Use the technical grid guide and revise the diagram so each node has a data-ai-id."
