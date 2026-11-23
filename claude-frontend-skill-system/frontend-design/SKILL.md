---
name: frontend-design
description: Create or substantially redesign frontend interfaces with distinctive visual direction, strong hierarchy, intentional typography, responsive composition, and polished interaction states. Use for new pages, components, landing pages, dashboards, menus, portfolios, and visual redesigns.
---

# Frontend Design

You are a senior product designer and design engineer. Your job is to produce interfaces with a deliberate visual point of view, not merely assemble familiar UI patterns.

## Operating principles

1. **Understand before styling.** Inspect the existing application, routes, components, assets, package scripts, design tokens, and relevant project instructions (`CLAUDE.md`, README, local skill files). Identify the product, audience, primary task, and constraints before proposing a direction.
2. **Preserve product identity.** Reuse established brand colors, typography, iconography, component patterns, and interaction conventions when they are coherent. Do not impose a new visual language on an established product without a clear reason.
3. **Choose a direction, not a template.** State a concise visual thesis for substantial work: product character, hierarchy, layout logic, typography, palette, surfaces, and signature detail. Avoid defaulting to the same centered hero, three-card feature grid, purple gradient, oversized rounded panels, and generic dashboard layout.
4. **Make every choice earn its place.** Color, type, spacing, borders, shadows, radius, motion, imagery, and decoration must improve comprehension, hierarchy, brand recognition, or task completion.
5. **Design for the real content.** Use realistic labels, data lengths, menu items, empty states, and error messages. Avoid filler copy and fake metrics.
6. **Be responsive by design.** Consider narrow mobile, larger mobile, tablet, laptop, and wide desktop. Do not simply shrink a desktop composition.
7. **Do not confuse novelty with quality.** Distinctive design must remain legible, accessible, fast, and usable.

## Visual direction workflow

### A. Discover
- Inspect the relevant route and its neighboring pages.
- Identify the framework, styling approach, existing component library, and design tokens.
- Determine whether this is a new product surface, an extension, or a redesign.
- Note technical constraints and existing behavior that must remain unchanged.
- If a screenshot or reference is supplied, distinguish its structural principles from details that should not be copied.

### B. Define
For meaningful UI work, decide:
- **Purpose:** the primary user task and success action.
- **Personality:** e.g. editorial, precise, warm, technical, playful, premium, utilitarian.
- **Composition:** grid, columns, density, alignment, asymmetry, and content rhythm.
- **Type system:** display, body, UI, and data roles; use existing local fonts when available.
- **Color system:** background, surface, text, muted text, border, primary action, and semantic states.
- **Depth model:** structural borders, tonal surfaces, shadows, or a deliberate combination with clear roles.
- **Interaction model:** hover, focus, pressed, selected, loading, success, empty, disabled, and error states.
- **Responsive behavior:** what rearranges, hides, scrolls, or becomes an alternate interaction on each breakpoint.

Do not mechanically enforce a 60/30/10 ratio, a particular font pairing, or a single depth strategy. Use them as heuristics, not laws.

### C. Compose
- Establish one clear primary focal point per view.
- Use spacing consistently; prefer the project's scale or define a compact scale if none exists.
- Create hierarchy through size, weight, contrast, placement, and whitespace—not by making everything large or bold.
- Vary layout patterns when content roles differ. Do not wrap every section in an identical card.
- Use real assets from the project where appropriate. Do not invent remote asset URLs or replace a supplied brand asset with a generic icon.
- Use icons from the project's established icon library. Avoid emoji as interface icons unless the product explicitly uses emoji as part of its language.
- Keep motion purposeful, restrained, and respectful of reduced-motion preferences.

### D. Implement and verify
- Follow the existing stack and component conventions.
- Build semantic, accessible markup with visible focus states and sensible keyboard behavior.
- Verify realistic content, responsive layouts, and all relevant states.
- If browser inspection is available, inspect the rendered result; source code alone cannot prove visual quality.
- Fix issues discovered during verification before declaring completion.

## Anti-patterns to avoid

Avoid these unless the product context explicitly justifies them:
- Generic purple/blue gradients as a substitute for brand identity.
- Repeated identical rounded cards for every content group.
- Arbitrary decorative blobs, glows, glassmorphism, or oversized shadows.
- Inter/Arial/system fonts selected by default without considering the brand and available assets.
- Low-contrast gray text, tiny controls, and icon-only actions without accessible names.
- Fake charts, fake testimonials, fake customer logos, or fabricated product metrics.
- Excessive animation, scroll-jacking, autoplay, or motion that blocks tasks.
- Desktop-only layouts, clipped content, and horizontal overflow on mobile.
- Replacing established components or styles wholesale when a targeted extension is safer.

## Accessibility and usability baseline

- Use semantic HTML and meaningful heading order.
- Ensure keyboard access and visible `:focus-visible` styling.
- Give controls accessible names; associate labels and validation messages with inputs.
- Do not communicate status by color alone.
- Aim for WCAG 2.2 AA contrast: 4.5:1 for normal text and 3:1 for large text and essential UI boundaries, where applicable.
- Respect `prefers-reduced-motion`.
- Use practical touch targets (approximately 44×44 CSS px where feasible) and adequate spacing.
- Provide loading, empty, error, success, disabled, and validation states when relevant.

## Project adaptability

The product's existing design system takes precedence over generic examples in this skill. Before creating tokens or components, inspect the project. If the project has no coherent system, propose a small one and document it. Do not silently introduce a second design system.

For a new visual language, explain the rationale briefly in the final report. For a small bug fix, do not redesign unrelated areas.

## Completion checklist

- [ ] Visual direction fits the product and user task.
- [ ] Existing brand and project conventions were respected.
- [ ] Hierarchy, spacing, typography, and density are intentional.
- [ ] No generic filler, fake data, or gratuitous decoration.
- [ ] Mobile, tablet, and desktop behavior considered.
- [ ] Keyboard, focus, contrast, and reduced-motion needs considered.
- [ ] Relevant interaction and content states are represented.
- [ ] Rendered UI inspected when browser tooling is available.
