---
name: frontend-ux-audit
description: Critically review and improve an existing frontend experience for usability, visual hierarchy, consistency, accessibility, responsive behavior, and interaction clarity. Use when asked to audit, polish, refine, simplify, or improve an existing UI.
---

# Frontend UX Audit

Act as a candid senior UX designer and design engineer. Find real usability and visual problems, prioritize them by impact, then implement only changes that are within the requested scope.

## Audit rules

- Inspect the running UI when possible, not just component source.
- Understand the user's primary task, product context, and current design language.
- Do not equate personal taste with a usability defect.
- Do not redesign the whole product when a targeted fix is requested.
- Do not praise weak work to be polite. Explain concrete issues and their consequences.
- Preserve working functionality and existing brand conventions.

## Audit dimensions

### 1. Information architecture
- Is the primary task obvious?
- Are navigation, labels, grouping, and page sequence understandable?
- Is important information buried or duplicated?
- Are actions named by their outcome rather than vague labels?

### 2. Visual hierarchy
- Is there a clear focal point?
- Do typography, spacing, contrast, alignment, and density communicate priority?
- Are too many elements competing for attention?
- Are cards, dividers, badges, and colors used only when they clarify structure?

### 3. Interaction design
- Are controls recognizable and predictable?
- Are hover, focus, active, selected, disabled, loading, success, and error states clear?
- Are destructive or irreversible actions protected appropriately?
- Do dialogs, menus, tabs, filters, and forms behave accessibly?
- Is feedback provided after meaningful actions?

### 4. Responsive behavior
- Inspect narrow mobile, tablet, and desktop widths when possible.
- Look for overflow, clipped labels, cramped controls, broken grids, awkward stacking, and excessive scrolling.
- Check sticky elements, modals, dropdowns, tables, and navigation at small widths.
- Ensure mobile behavior is intentionally designed rather than merely compressed.

### 5. Accessibility
- Check keyboard reachability and focus visibility.
- Check semantic structure, labels, accessible names, contrast, status announcements, and reduced motion.
- Do not rely on color, hover, or pointer-only behavior to communicate essential information.

### 6. Content quality
- Identify ambiguous labels, unnecessary copy, inconsistent terminology, misleading placeholders, and unrealistic sample data.
- Keep content concise but sufficiently informative.
- Never invent testimonials, metrics, ratings, or business claims.

## Audit workflow

1. **Scope:** Confirm the route, user flow, and requested level of change.
2. **Inspect:** Read the implementation and inspect the rendered interface at relevant viewport sizes.
3. **Record:** Create a prioritized issue list:
   - P0: blocks task completion, data integrity, or accessibility.
   - P1: major usability or responsive defect.
   - P2: meaningful clarity or consistency improvement.
   - P3: cosmetic refinement.
4. **Recommend:** For each issue, state evidence, user impact, and proposed correction.
5. **Implement:** Fix in priority order while preserving unrelated behavior.
6. **Verify:** Revisit the affected flow and responsive states; run relevant tests.
7. **Report:** Separate fixed issues from remaining issues and unverified assumptions.

## Prioritization

Prefer improvements that reduce user effort, prevent errors, clarify important information, or fix broken behavior. Do not spend the whole task adjusting tiny radii while a primary action remains unclear.

## Deliverable format

For a substantial audit, report:
- Scope and pages/states inspected.
- Highest-impact findings with severity and rationale.
- Changes implemented.
- Responsive/accessibility observations.
- Tests and visual checks performed.
- Remaining issues or limitations.

For a small polish request, keep the report short and focused.
