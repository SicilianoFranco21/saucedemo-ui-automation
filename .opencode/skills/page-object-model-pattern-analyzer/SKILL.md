---
name: page-object-model-pattern-analyzer
description: Evaluate Playwright TypeScript test automation code against Page Object Model (POM) conventions — base class hierarchy, component composition, locator strategy, fixture usage, and test-body purity. Use during code review of page objects, components, fixtures, or spec files in a Playwright POM project.
---

# Page Object Model Pattern Analyzer

This skill evaluates Playwright TypeScript automation code against the Page Object Model pattern as commonly implemented in projects with a base-class hierarchy, scoped components, and a typed fixture layer. It is reusable across any project that follows this structure — the repo-specific file paths and conventions (e.g. exact base class names) should come from the calling agent's own context, not from this skill.

## What to check

### 1. Base class selection

- Every page class must extend a base class — never implement `Page`-driven behavior standalone.
- Flag a page that duplicates header/footer/nav-menu logic already available on a shared base class instead of extending it.
- Flag a page extending the "has shared chrome" base class when it has none of that UI (over-inheriting), or extending the bare base when it actually shares that structure (under-inheriting).
- Liskov check: an overridden method on a subclass should not behave in a way callers of the base type wouldn't expect (e.g. a subclass override that throws where the base silently no-ops, or vice versa).

### 2. Components vs. Pages

- Components must receive a root `Locator` in their constructor — **never** a `Page`. Flag any component constructor typed to accept `Page`; it breaks scoping and reusability across pages.
- Components should be reusable across more than one page context. If a "component" only ever appears in one page and holds no independent scoping logic, question whether it should just be inline locators/methods on that page instead (KISS-adjacent — flag but don't force extraction).
- Page objects compose components rather than re-implementing their internals.

### 3. Locator strategy

- Locators must use `page.getByTestId()` (or the project's declared `data-test` equivalent) exclusively.
- Flag any CSS selector, XPath, text-based selector (`getByText` used as a primary locator), or nth-child/index-based selector — these are brittle and violate the convention regardless of whether they "work."
- Flag locators redefined inline inside test files instead of living on the page/component — this signals the page object is incomplete and tests are compensating for it.

### 4. Encapsulation of interactions

- Page methods must encapsulate all interactions. A test body containing a raw `page.click(...)`, `page.fill(...)`, or any direct Playwright call (instead of calling a page-object method) is a violation — this is the single most common and most important POM violation to catch.
- Assertions in test bodies against page-object-exposed locators (e.g. `expect(examplePage.submitButton).toBeVisible()`) are fine — the assertion isn't an "interaction," and forcing every assertion into a page-object method usually adds indirection without value (KISS).
- Flag business logic (conditionals, loops driving multiple UI steps) living in the test body when it represents a repeatable workflow — that likely belongs as a named method on the page object instead.

### 5. Fixtures

- Any page fixture requiring an authenticated session must depend on the project's authenticated-page fixture, not the raw `page` fixture. Flag any fixture instantiating a page object directly with `page` when that page requires a logged-in session.
- Fixtures should return an already-constructed page object — tests should never instantiate `new SomePage(page)` themselves inside a test body.
- New fixtures should follow the existing type-registration pattern in the fixtures file, not diverge with ad hoc typing.

### 6. Test structure

- Tests interact only through page object methods and component accessors — never raw Playwright API calls (see §4).
- Comments inside test bodies should mark Given/When/Then structure if that's the project's convention; flag missing or malformed structure only when the project convention requires it (source this from the calling agent's CONTRIBUTING.md read, not from this skill).
- Flag hardcoded test data inline in a spec when a typed data file/model already exists for that entity — it fragments the source of truth.

## Scalability check

For any new page, component, or fixture pattern introduced, ask: does this look like the other 5+ examples already in the codebase, or does it invent a new shape? A one-off pattern that diverges from established structure is a maintenance cost even if it "works" — flag it as `Minor`/`Suggestion` unless it actively breaks something, in which case escalate.

## Output contract

Return findings in the same severity/location/issue/recommendation shape the calling agent uses. Tag each finding with which POM concern it falls under: `Base Class`, `Component Scoping`, `Locator Strategy`, `Interaction Encapsulation`, `Fixtures`, or `Test Structure`.
