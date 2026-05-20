# Contributing Guide

This document explains how to extend the framework — adding new pages, components, fixtures, test data, and tests — while keeping everything consistent with existing conventions.

---

## Table of Contents

- [Project conventions](#project-conventions)
- [Adding a new Page Object](#adding-a-new-page-object)
- [Adding a new Component](#adding-a-new-component)
- [Registering a new Fixture](#registering-a-new-fixture)
- [Adding test data](#adding-test-data)
- [Writing a new spec file](#writing-a-new-spec-file)
- [Tagging strategy](#tagging-strategy)
- [Running a specific module](#running-a-specific-module)

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

### 2. Create the file under `pages/`

```typescript
// pages/example-page.ts
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

Components live in `pages/components/`. They receive a **root `Locator`** in the constructor — never `Page` — so they are scoped to their container and reusable across pages.

```typescript
// pages/components/example.component.ts
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

Then compose it in the Page Object:

```typescript
import { ExampleComponent } from './components/example.component.js';

export class ExamplePage extends SauceDemoBasePage {
  readonly example: ExampleComponent;

  constructor(page: Page) {
    super(page);
    this.example = new ExampleComponent(page.getByTestId('example-container'));
  }
}
```

---

## Registering a new Fixture

All fixtures live in `fixtures/fixtures.ts`. Every page fixture that requires authentication must depend on `authenticatedPage`, not on `page` directly.

### 1. Add the type to `SauceDemoFixtures`

```typescript
type SauceDemoFixtures = {
  // ... existing fixtures
  examplePage: ExamplePage;
};
```

### 2. Import the Page Object

```typescript
import { ExamplePage } from '../pages/example-page.js';
```

### 3. Add the fixture implementation

```typescript
examplePage: async ({ authenticatedPage }, use) => {
  const examplePage = new ExamplePage(authenticatedPage);
  await use(examplePage);
},
```

The fixture is now available in any test as `{ examplePage }` without any additional imports.

---

## Adding test data

Test data lives in `data/*.json` and is typed via interfaces in `models/`.

### Adding a new entry to an existing dataset

Open the relevant JSON file and add the new entry following the existing shape:

```json
// data/products.json
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

1. Create `data/new-dataset.json`
2. Define the TypeScript interface in `models/new-dataset.model.ts`
3. Import in the spec with `with { type: 'json' }`:

```typescript
import newData from '../../data/new-dataset.json' with { type: 'json' };
```

---

## Writing a new spec file

### File location

```
tests/
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

Tests that exercise the login form must opt out of the pre-authenticated session:

```typescript
test.use({ storageState: undefined });
```

Place this at the top of the `test.describe` block before any test definitions.

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
npx playwright test tests/cart/

# Run a single spec file
npx playwright test tests/cart/cart.spec.ts

# Run tests matching a name pattern
npx playwright test --grep "adds.*to the cart"

# Run smoke tests only
npm run test:smoke

# Run with UI mode for debugging
npm run test:ui
```
