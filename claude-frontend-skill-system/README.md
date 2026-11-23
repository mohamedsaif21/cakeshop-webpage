# Claude Code — Reusable Frontend Skill System

A global, project-adaptable frontend skill toolkit for Claude Code.

## Included skills

| Skill | Responsibility | Invoke |
|---|---|---|
| `frontend-design` | Visual direction and interface design | `/frontend-design` |
| `frontend-engineering` | Production frontend implementation | `/frontend-engineering` |
| `frontend-ux-audit` | UX critique and interface refinement | `/frontend-ux-audit` |
| `frontend-visual-testing` | Browser-based visual and interaction QA | `/frontend-visual-testing` |
| `frontend-design-system` | Tokens, components, and product adaptation | `/frontend-design-system` |

Claude Code can also select skills automatically when the task description matches. Explicit invocation is useful when you want to guarantee a particular workflow is considered.

## Install globally (Windows PowerShell)

1. Extract this package.
2. Open PowerShell in the extracted `claude-frontend-skill-system` folder.
3. Run:

```powershell
.\install.ps1
```

The installer copies the five skill directories into:

```text
$HOME\.claude\skills\
```

It creates a timestamped backup if a destination skill directory already exists. Review the script before running it if you want to change the backup or overwrite behavior.

### Manual installation

Copy the five skill folders into:

```text
C:\Users\<your-user>\.claude\skills\
```

The final structure should be:

```text
~/.claude/skills/
├── frontend-design/SKILL.md
├── frontend-engineering/SKILL.md
├── frontend-ux-audit/SKILL.md
├── frontend-visual-testing/SKILL.md
└── frontend-design-system/SKILL.md
```

Do not put all five `SKILL.md` files directly in `skills/`; each skill needs its own directory.

## Verify

1. Start a new Claude Code session (or reload the session if needed).
2. Run `/skills` or use the available skills listing in your Claude Code version.
3. Try `/frontend-design` on a small UI task.
4. Ask Claude to explain which frontend skills it can use.
5. If a skill is not discovered, verify the exact path and YAML frontmatter, then restart Claude Code.

## Recommended project onboarding

Global skills provide reusable workflows. They do not know each project's brand or constraints in advance.

At the root of each project, maintain a concise `CLAUDE.md` containing project facts, for example:

- Product purpose and target users.
- Framework, package manager, and important versions.
- Run, test, lint, and build commands.
- Existing design system, component library, and asset locations.
- Brand colors, typography, and visual references.
- Responsive breakpoints and supported browsers/devices.
- Important routes and critical user flows.
- Constraints: files or behavior that must not change, API/security rules, and known limitations.

Keep project facts in `CLAUDE.md`; keep repeatable procedures in skills. Do not copy the entire skill text into every project.

## Suggested usage

### New page or component

```text
/frontend-design

Inspect this project and the target route first. Follow its existing brand
and design system. Propose a concise visual direction, then implement the
requested page. Verify responsive behavior and relevant states.
```

### Feature implementation

```text
/frontend-engineering

Implement [feature] in the existing architecture. Preserve current behavior,
follow project conventions, add appropriate tests, and report the checks run.
```

### Existing UI refinement

```text
/frontend-ux-audit

Audit [route/component]. Identify the highest-impact usability and visual
issues, prioritize them, implement the in-scope fixes, and verify the result.
```

### Browser QA

```text
/frontend-visual-testing

Test [route/flow] at mobile, tablet, and desktop sizes using the browser
tooling already available in this repository. Fix regressions introduced
by the current work and report anything that could not be tested.
```

### Establish project design language

```text
/frontend-design-system

Inspect this repository's existing UI and document its actual design system.
Preserve established brand patterns. Identify inconsistencies and propose
an incremental standardization plan before making broad changes.
```

## Important operating rules

- Skills are instructions, not installed tools. `frontend-visual-testing` does not install or provide Playwright, browser binaries, or an MCP browser connection.
- Do not install dependencies or external tools without authorization.
- Use the project's existing stack; do not assume React, Next.js, Tailwind, or a specific component library.
- Inspect before editing. Preserve unrelated work and existing product behavior.
- Never claim browser verification, tests, or builds passed unless they were actually run.
- Distinct products should retain distinct visual identities. Shared standards should improve quality, not make every project look identical.

## Updating

Keep this package under version control or retain the original ZIP. To update, extract the newer package and rerun `install.ps1`. The installer backs up existing destination skill folders before copying the new versions.
