# Contributing Guide

This document explains how to extend the framework — adding new pages, components, fixtures, test data, and tests — while keeping everything consistent with existing conventions.

---

## Table of Contents

- [Environment setup](#environment-setup)
- [Project conventions](#project-conventions)
- [Adding a new Page Object](#adding-a-new-page-object)
- [Adding a new Component](#adding-a-new-component)
- [Registering a new Fixture](#registering-a-new-fixture)
- [Adding test data](#adding-test-data)
- [Writing a new spec file](#writing-a-new-spec-file)
- [Tagging strategy](#tagging-strategy)
- [Running a specific module](#running-a-specific-module)
- [Git workflow](#git-workflow)
- [Code review](#code-review)

---

## Environment setup

Follow the installation steps in [README.md](./README.md#installation--setup). Once dependencies and browsers are installed, verify everything works by running the full suite:

```bash
npm test
```

No environment variables are required.

---

## Project conventions

| Convention | Rule |
|------------|------|
| File names | `kebab-case.ts` — e.g. `checkout-step-one-page.ts`, `product-item.component.ts` |
| Class names | `PascalCase` — e.g. `CheckoutStepOnePage`, `ProductItemComponent` |
| Imports | Always use `.js` extension — e.g. `from '../pages/cart-page.js'` (ES module requirement) |
| Selectors | `data-test` attributes only via `page.getByTestId()` — no CSS classes, no XPath |
| Test comments | Gherkin style: `// Given`, `// When`, `// Then` inside each test body |
| Test imports | Always from `fixtures/fixtures.js`, never from `@playwright/test` directly |
| JSON imports | Use `with { type: 'json' }` syntax |

---

## Adding a new Page Object

### 1. Choose the right base class

- The page has a header, footer, side menu, and secondary header → extend `SauceDemoBasePage`
- The page has none of those (e.g. login screen) → extend `BasePage`

### 2. Create the file under `playwright/pages/`

```typescript
// playwright/pages/example-page.ts
import type { Page } from '@playwright/test';
import { SauceDemoBasePage } from './saucedemo-base-page.js';

export class ExamplePage extends SauceDemoBasePage {
  readonly url: string = '/example.html';

  constructor(page: Page) {
    super(page);
  }
}
```

### 3. Add locators and methods for page-specific elements

```typescript
export class ExamplePage extends SauceDemoBasePage {
  readonly url: string = '/example.html';
  readonly submitButton: Locator;

  constructor(page: Page) {
    super(page);
    this.submitButton = page.getByTestId('submit-button');
  }

  async submit(): Promise<void> {
    await this.submitButton.click();
  }
}
```

---

## Adding a new Component

Components live in `playwright/pages/components/`. They receive a **root `Locator`** in the constructor — never `Page` — so they are scoped to their container and reusable across pages.

```typescript
// playwright/pages/components/example.component.ts
import type { Locator } from '@playwright/test';

export class ExampleComponent {
  readonly root: Locator;
  readonly title: Locator;

  constructor(root: Locator) {
    this.root = root;
    this.title = root.getByTestId('example-title');
  }

  async getTitle(): Promise<string> {
    return this.title.innerText();
  }
}
```

Then compose it in the Page Object. Declare the root locator as a named variable first so the intent is clear:

```typescript
import { ExampleComponent } from './components/example.component.js';

export class ExamplePage extends SauceDemoBasePage {
  readonly example: ExampleComponent;

  constructor(page: Page) {
    super(page);
    const exampleContainer = page.getByTestId('example-container');
    this.example = new ExampleComponent(exampleContainer);
  }
}
```

---

## Registering a new Fixture

Fixtures are split across two files and merged in a third:

| File | Owns |
|------|------|
| `playwright/fixtures/navigation.fixture.ts` | `authenticatedPage` |
| `playwright/fixtures/page-object.fixture.ts` | All Page Object fixtures |
| `playwright/fixtures/fixtures.ts` | Merges both; re-exports `test` and `expect` |

Every page fixture that requires authentication must depend on `authenticatedPage`, not on `page` directly.

### 1. Add the type to `PageObjectFixtures` in `page-object.fixture.ts`

```typescript
export type PageObjectFixtures = {
  // ... existing fixtures
  examplePage: ExamplePage;
};
```

### 2. Import the Page Object and add the fixture implementation

```typescript
import { ExamplePage } from '../pages/example-page.js';

export const pageObjectFixtures = {
  // ... existing fixtures
  examplePage: async ({ authenticatedPage }: FixtureContext, use: FixtureUse<ExamplePage>) => {
    const examplePage = new ExamplePage(authenticatedPage);
    await use(examplePage);
  },
};
```

### 3. Register it in `fixtures.ts`

```typescript
const fixtures = {
  // ... existing fixtures
  examplePage: pageObjectFixtures.examplePage,
};
```

The fixture is now available in any test as `{ examplePage }` without any additional imports.

---

## Adding test data

Test data lives in `playwright/data/*.json` and is typed via interfaces in `playwright/models/`.

### Adding a new entry to an existing dataset

Open the relevant JSON file and add the new entry following the existing shape:

```json
// playwright/data/products.json
{
  "products": {
    "existingProduct": { ... },
    "newProduct": {
      "id": 99,
      "name": "New Product Name",
      "description": "Product description.",
      "price": 19.99
    }
  }
}
```

Tests that iterate over the dataset will automatically pick up the new entry — no spec changes needed.

### Adding a new dataset

1. Create `playwright/data/new-dataset.json`
2. Define the TypeScript interface in `playwright/models/new-dataset.model.ts`
3. Import in the spec with `with { type: 'json' }`:

```typescript
import newData from '../../data/new-dataset.json' with { type: 'json' };
```

---

## Writing a new spec file

### File location

```
playwright/tests/
└── <module>/
    └── <module>.spec.ts
```

### Spec structure

```typescript
import { test, expect } from '../../fixtures/fixtures.js';

// Feature: <Feature name>

test.describe('<Page or feature>', { tag: '@regression' }, () => {
  // Rule: <Business rule being tested>

  test('<what should happen>', async ({ examplePage }) => {
    // Given <precondition>

    // When <action>

    // Then <expected outcome>
    await expect(examplePage.submitButton).toBeVisible();
  });
});
```

### Login tests — special case

Tests that exercise the login form must opt out of the pre-authenticated session. Place this at **file level**, before any `test.describe` block:

```typescript
import { test, expect } from '../../fixtures/fixtures.js';

test.use({ storageState: undefined });

test.describe('Login', { tag: '@regression' }, () => {
  // ...
});
```

---

## Tagging strategy

Every `test.describe` block must have at least one tag.

| Tag | When to use |
|-----|-------------|
| `@smoke` | Critical path — login, add to cart, complete checkout. Should pass in under 2 minutes. |
| `@regression` | Full coverage — all scenarios including edge cases and validation. Applied to every suite. |

A suite can have both tags. `@smoke` is a subset of `@regression`.

```typescript
test.describe('Add to Cart', { tag: ['@smoke', '@regression'] }, () => { ... });
```

---

## Running a specific module

```bash
# Run all tests in a folder
npx playwright test playwright/tests/cart/

# Run a single spec file
npx playwright test playwright/tests/cart/cart.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "adds.*to the cart"

# Run smoke tests only
npm run test:smoke

# Run with UI mode for debugging
npm run test:ui
```

---

## Git workflow

### Branches

```
<type>/<short-description>

# Examples
feat/add-checkout-page
fix/cart-badge-count
docs/update-contributing
refactor/split-fixture-files
```

| Type | When to use |
|------|-------------|
| `feat` | New page, component, fixture, or test |
| `fix` | Bug fix in existing code |
| `docs` | Documentation only |
| `refactor` | Code restructuring without behaviour change |
| `chore` | Tooling, config, or dependency updates |

### Commits

```
<type>(<scope>): <short description in imperative mood>

# Examples
feat(checkout): add checkout complete page object
fix(cart): correct badge count after item removal
docs(contributing): add git workflow section
test(inventory): add smoke tag to add-to-cart suite
```

- Keep the subject line under 72 characters
- Use imperative mood: "add" not "added" or "adds"
- Reference issues or PRs in the body when relevant

### Pull requests

1. Branch off `main`
2. Keep PRs focused — one feature or fix per PR
3. Ensure `npm test` passes locally before opening a PR
4. Fill in the PR description: what changed and why
5. Request at least one review before merging

---

## Code review

### Process

1. Open a PR against `main` with a clear description
2. The reviewer checks for correctness, conventions, and test coverage
3. Address all comments before merging
4. Squash or rebase as agreed with the reviewer before merge

### What reviewers check

| Area | Criteria |
|------|----------|
| **POM conventions** | Correct base class, components receive `root: Locator`, fixtures depend on `authenticatedPage` |
| **Selectors** | Only `data-test` attributes via `getByTestId()` — no CSS classes, no XPath |
| **TypeScript** | No `any`, correct use of `import type`, array index access null-checked |
| **Tests** | Gherkin comments present, correct tag (`@smoke` / `@regression`), no hardcoded values |
| **Design principles** | No duplication, single responsibility, no unnecessary complexity |

### Automated review

This project includes an OpenCode `code-reviewer` agent that applies CONTRIBUTING.md rules, POM conventions, and SOLID/DRY/KISS principles. It operates in read-only mode — it analyses and suggests but does not modify files. Run it via OpenCode before requesting a human review for a first pass.
