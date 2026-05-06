---
name: design-guide-authoring
description: Use this skill when the user asks to create, revise, extend, audit, or improve a reusable design guide for this slide deck workspace, especially files under designs/ or guidance for slide visual style, typography, layout, color, motion, and agent prompting.
---

# Design Guide Authoring

## Workflow

1. Understand the target audience, mood, use case, and presentation context.
2. For new guides, use `assets/design-guide-template.md` as the starting structure.
3. Read `assets/design-guide-example.md` when you need a reference for the expected specificity and density.
4. Create or edit one Markdown file under `designs/`.
5. Keep the guide reusable across decks, not tailored to one specific slide.
6. Give concrete implementation guidance that a coding agent can apply in React and Tailwind.
7. Avoid vague-only direction such as "make it modern" or "make it beautiful."
8. Avoid repository implementation clutter unless it materially affects visual execution.
9. Validate that all required sections are present before finishing.

## Required Sections

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

## Guidance Quality

- Provide concrete palettes, spacing rules, type scale ranges, and composition patterns.
- Explain when to use dense layouts and when to keep slides sparse.
- Specify icon, chart, image, background, and card treatment where relevant.
- Include practical do/don't bullets that reduce common visual mistakes.
- Keep the Agent Prompt Guide short enough to paste into a future slide-generation request.

## Gotchas

- A design guide is not a slide outline.
- Do not include per-slide content unless the user explicitly asks for a deck-specific guide.
- Do not require a new dependency just to satisfy a visual style.
- Do not solve runtime behavior in a design guide; keep it focused on visual authoring.
