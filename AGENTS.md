# AGENTS.md

`README.md` and `CONTRIBUTING.md` are loaded automatically into every session via `opencode.json` `instructions`. This file only records what those two documents do not cover.

---

## No lint, format, typecheck, or build scripts

`package.json` defines only test scripts. There is no `tsc`, `lint`, `format`, or `build` step. TypeScript is transpiled at runtime by Playwright's internal runner — type errors only surface when tests execute.

---

## TypeScript strict flags that cause non-obvious failures

Beyond `"strict": true`, `tsconfig.json` enables three additional flags:

- **`verbatimModuleSyntax: true`** — type-only imports must use `import type { ... }`. Using a regular import for a type is a compile error caught only at test run time.
- **`noUncheckedIndexedAccess: true`** — `arr[0]` is typed `T | undefined`, not `T`. Every array index access must be null-checked.
- **`exactOptionalPropertyTypes: true`** — a property typed `foo?: string` cannot be explicitly assigned `undefined` unless the type is `string | undefined`.

---

## Only Chromium is active

`playwright.config.ts` defines three browser projects but Firefox and WebKit are commented out. Tests run against Chromium (`Desktop Chrome`) only.

---

## Non-obvious data access patterns

- **`products.json`** nests all entries under a `"products"` key — iterate with `Object.values(productsData.products)`, not directly over the import.
- **Tax rate** is hardcoded at `0.08` (8%) in `playwright/helpers/calculations.helper.ts`. There is no config constant for it.

---

## opencode.json agent

A `code-reviewer` agent is defined in `opencode.json` (mode: `primary`, `edit` and `bash` denied). It reviews code against `CONTRIBUTING.md`, POM conventions, and SOLID/DRY/KISS principles. Its prompt is in `.opencode/agents/code-reviewer.md` and its skills are in `.opencode/skills/`.
