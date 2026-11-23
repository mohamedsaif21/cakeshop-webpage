---
name: frontend-design-system
description: Discover, define, document, and maintain a coherent design system that adapts to each product's brand, users, content, and technical stack. Use when starting a frontend project, establishing design tokens, standardizing components, or resolving inconsistent UI patterns.
---

# Frontend Design System

Act as a design-systems lead. Establish the smallest coherent system that improves consistency without flattening the product's personality.

## 1. Discover before defining

Inspect:
- Existing brand assets, logos, fonts, colors, and product guidelines.
- CSS variables, Tailwind/theme configuration, component libraries, and shared UI primitives.
- Representative pages across key workflows.
- Existing accessibility and responsive conventions.
- Framework, build system, and constraints.

Classify findings:
- **Established:** consistent, reusable patterns worth preserving.
- **Emerging:** useful patterns applied inconsistently.
- **Conflicting:** duplicated or contradictory tokens/components.
- **Missing:** essential roles with no defined pattern.

Do not assume a blank slate because documentation is missing. The rendered product may contain an implicit system.

## 2. Create a product-specific profile

For a new or substantially evolving project, define:
- Product purpose, audience, and primary tasks.
- Brand personality and desired emotional tone.
- Visual principles and anti-patterns specific to the product.
- Color roles: canvas, surface, text, muted text, border, primary action, focus, and semantic feedback.
- Typography roles: display, heading, body, label, caption, and data.
- Spacing and layout scale.
- Radius, border, elevation, and focus treatment.
- Breakpoints and responsive behavior.
- Interaction and motion principles.
- Component inventory and variant rules.

Use existing tokens where possible. Choose values based on the product and verify contrast; do not impose arbitrary universal palettes or ratios.

## 3. Token design

Prefer semantic tokens over component-specific magic values. Example role names:

```css
:root {
  --color-canvas: ...;
  --color-surface: ...;
  --color-text: ...;
  --color-text-muted: ...;
  --color-border: ...;
  --color-action: ...;
  --color-focus: ...;

  --font-display: ...;
  --font-body: ...;
  --font-mono: ...;

  --space-1: ...;
  --space-2: ...;
  --space-3: ...;

  --radius-control: ...;
  --radius-panel: ...;
}
```

These are naming examples, not prescribed values. Adapt to the existing stack (CSS variables, Tailwind theme, CSS modules, styled components, or another established method). Avoid maintaining duplicate token sources.

## 4. Component standards

For each shared component, define:
- Purpose and when to use it.
- Semantic element and accessibility behavior.
- Supported variants and sizes.
- States: default, hover, focus, active, selected, disabled, loading, invalid, and responsive where relevant.
- Content constraints and composition guidance.
- Examples of correct and incorrect use.

Build shared components only where repeated patterns justify them. Keep product-specific components local until reuse is demonstrated.

## 5. Adaptation across products

A shared skill system does not mean every project shares the same visual identity.

Examples of distinct product needs:
- Operational POS: efficient scanning, compact data density, clear statuses, fast keyboard/touch workflows.
- Restaurant digital menu: appetizing content presentation, readable menu hierarchy, quick category navigation, mobile-first ordering or browsing.
- Agency/technology website: credible brand storytelling, strong editorial hierarchy, polished proof points, clear conversion paths.
- Personal portfolio: individual voice, project storytelling, visual evidence, and clear navigation.

Treat these as examples, not fixed templates. Derive the actual direction from the current repository and user brief.

## 6. Documentation and migration

When asked to document a system:
- Use the project's existing documentation location and format.
- Prefer a concise source of truth such as `docs/design-system.md` or the existing equivalent.
- Record token definitions, typography, components, variants, accessibility, responsive behavior, and usage examples.
- Identify duplicate or conflicting patterns before changing them.
- Migrate incrementally; avoid broad replacements without visual and functional verification.
- Do not overwrite existing documentation without inspecting and preserving useful content.

## 7. Governance

- New components must use semantic tokens where appropriate.
- Changes to shared tokens require checking affected routes.
- Avoid one-off exceptions becoming undocumented defaults.
- Record intentional exceptions with a reason.
- Review accessibility and responsive behavior alongside visual consistency.

## Definition of done

The system reflects the actual product, has a clear source of truth, minimizes duplicated values and components, preserves brand distinction, and has been checked on representative screens.
