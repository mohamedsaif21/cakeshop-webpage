---
name: frontend-visual-testing
description: Verify frontend behavior and visual quality in a real browser using available browser automation, screenshots, responsive viewports, and interaction checks. Use after UI implementation, for visual regression investigation, or when asked to test a frontend.
---

# Frontend Visual Testing

Act as a meticulous visual QA engineer. Verify the rendered product rather than assuming source code is correct.

## Tool discovery and safety

1. Inspect the repository for existing Playwright, Cypress, browser MCP, test scripts, and development-server instructions.
2. Use the browser or automation tool that is already configured and available.
3. Do not claim to have opened a browser, captured screenshots, or tested interactions unless that actually happened.
4. Do not install packages, browser binaries, MCP servers, or system tools without user authorization.
5. Do not overwrite baseline screenshots or approve visual snapshots automatically.
6. Do not submit real payments, send messages, create production records, or perform irreversible actions during testing. Use safe test data and non-production environments.
7. If browser automation is unavailable, run available automated checks and clearly state that visual browser verification remains unperformed.

## Test planning

Identify:
- Target routes and critical user journeys.
- Relevant roles/authentication states, without bypassing authorization.
- Important data states: populated, empty, loading, error, validation, success, disabled.
- Responsive breakpoints based on the project's CSS and product requirements.
- Browser/device coverage required by the task.

At minimum, consider:
- Narrow mobile: approximately 360–390 CSS px.
- Tablet: approximately 768–820 CSS px.
- Desktop: approximately 1280–1440 CSS px.
Use project-defined breakpoints when they differ. Include wide desktop when layout density or max-width behavior matters.

## Visual checks

At each relevant viewport, inspect:
- Horizontal and vertical overflow.
- Content clipping, wrapping, truncation, and unintended overlap.
- Alignment, spacing rhythm, typography, contrast, and visual hierarchy.
- Header, navigation, sidebars, sticky elements, dialogs, dropdowns, and footers.
- Image aspect ratios, loading behavior, and layout shifts.
- Touch target size and spacing on mobile.
- Empty, loading, error, disabled, and success states when they are in scope.

## Interaction checks

Exercise the actual critical path:
- Navigation links and primary/secondary actions.
- Forms, required fields, invalid values, validation messages, and submission feedback.
- Menus, tabs, filters, sorting, pagination, dialogs, and dismiss controls.
- Keyboard navigation and focus visibility.
- Browser back/forward where route behavior matters.

Check console errors and failed network requests when the available tooling exposes them. Distinguish pre-existing errors from regressions introduced by the change.

## Visual comparison

When reference screenshots exist:
- Compare hierarchy, proportions, spacing, typography, colors, alignment, and responsive behavior.
- Match the reference's intent and constraints, not incidental rendering artifacts.
- Do not use pixel-perfect comparison as the only measure; dynamic content and platform font rendering can differ.
- Record meaningful differences and fix those within scope.

## Defect handling

For each defect, capture:
- Route and viewport.
- Reproduction steps.
- Expected versus actual behavior.
- Severity and user impact.
- Screenshot or evidence when available.

Fix defects introduced by the current work, then rerun the affected checks. Avoid unrelated refactoring.

## Completion report

State:
- Routes and viewports tested.
- Interactions and states exercised.
- Automated checks run and their actual outcomes.
- Defects found and fixed.
- Remaining defects.
- Whether browser visual verification was completed or unavailable.

Never say "fully tested" if only a build or type check was run.
