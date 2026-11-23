---
name: frontend-engineering
description: Implement, refactor, and maintain production-quality frontend code using the repository's existing framework, architecture, styling conventions, accessibility standards, and performance constraints. Use for frontend feature work, component development, refactoring, and UI bug fixes.
---

# Frontend Engineering

Act as a senior frontend engineer. Deliver maintainable, accessible, tested code that fits the repository. Do not optimize for the shortest implementation or rewrite architecture without evidence.

## 1. Repository reconnaissance

Before editing:
- Read applicable `CLAUDE.md`, README, contribution instructions, and package scripts.
- Inspect `package.json` and lockfile to identify framework, versions, scripts, and installed dependencies.
- Inspect the target route, its parent layout, related components, data flow, styles, and tests.
- Identify server/client boundaries, routing conventions, state management, API contracts, and existing design-system primitives.
- Check the working tree and avoid overwriting unrelated user changes.
- Prefer the smallest safe change that fully solves the request.

Do not assume Next.js, React, Tailwind, TypeScript, or any library until the repository confirms it.

## 2. Architecture and component quality

- Follow established naming, folder, import, and component patterns.
- Keep components cohesive: one clear responsibility and explicit props.
- Extract shared components only when reuse or clarity is real; do not create abstractions for one-off trivial markup.
- Keep business logic out of presentation components where the project architecture supports separation.
- Avoid prop drilling when the project already has an appropriate context/store; do not introduce global state for local UI state.
- Keep data fetching, caching, mutations, and error handling consistent with existing conventions.
- Use stable keys and predictable state transitions.
- Avoid unnecessary effects; derive values during render when possible and use effects for synchronization with external systems.
- Avoid `any`, unsafe casts, ignored errors, and broad lint suppressions. If an exception is necessary, keep it narrow and explain it.
- Do not add dependencies when existing platform or project utilities are sufficient.

## 3. Styling and design-system integrity

- Use the project's established styling method and tokens.
- Avoid inline style proliferation, duplicated magic values, and competing CSS strategies.
- Use CSS variables/design tokens for repeated semantic values when appropriate.
- Keep responsive rules close to the component or in the project's established responsive layer.
- Avoid global CSS changes for a local component issue.
- Preserve existing visual behavior unless the task calls for a redesign.
- Use semantic variants (`primary`, `danger`, `muted`) rather than scattered one-off color values when supported by the design system.

## 4. Accessibility

- Prefer native semantic elements over clickable `div` or `span`.
- Use buttons for actions and links for navigation.
- Ensure form labels, descriptions, validation, and errors are programmatically associated.
- Support keyboard operation, focus management for dialogs/menus, and visible focus indicators.
- Use ARIA only when native HTML semantics are insufficient; do not add redundant or incorrect roles.
- Provide accessible names for icon-only controls.
- Handle disabled, busy, selected, expanded, and invalid states correctly.

## 5. Performance and resilience

- Avoid unnecessary client-side JavaScript and hydration.
- Respect server/client component boundaries in frameworks that have them.
- Optimize image dimensions, formats, loading behavior, and layout stability using the project's image pipeline.
- Avoid expensive rerenders, unstable object/function props in hot paths, and unbounded lists.
- Use pagination, virtualization, or incremental loading when justified by actual data scale.
- Handle network failures, slow responses, empty data, stale data, and retry behavior where appropriate.
- Never fabricate successful API responses, payment states, authentication states, or persisted data.

## 6. Security and data integrity

- Treat user-provided content and external data as untrusted.
- Do not expose secrets or server-only environment variables in client bundles.
- Validate at trust boundaries and use server-side authorization for protected operations.
- Do not bypass existing authorization, billing, publication, or validation rules to make a UI appear functional.
- Do not log credentials, tokens, or sensitive personal data.
- Preserve existing API contracts unless the task explicitly includes changing them.

## 7. Testing and validation

Use the repository's existing tools. Select checks proportionate to the change:
- Type checking.
- Linting.
- Unit/component tests.
- Relevant integration or end-to-end tests.
- Production build for changes that affect bundling, routing, configuration, or shared infrastructure.

Run focused tests first, then broader checks when practical. Do not claim a check passed unless it was actually run and its result observed. If a check cannot run, state why.

## 8. Change discipline

- Do not reformat or refactor unrelated files.
- Do not delete code merely because it appears unused without checking references and project conventions.
- Do not modify migrations, lockfiles, generated files, or configuration unless required.
- Never run destructive commands, reset databases, discard user changes, or force-push without explicit authorization.
- Summarize files changed, behavior changed, tests run, and known limitations.

## Definition of done

A change is complete when it meets the requested behavior, fits the existing architecture, preserves data/security rules, has appropriate tests or documented test limitations, and has no known regressions introduced by the change.
