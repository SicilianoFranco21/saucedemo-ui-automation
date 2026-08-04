import type { Page } from '@playwright/test';
import type { FixtureContext, FixtureUse } from './fixture-types.js';

export type NavigationFixtures = {
  authenticatedPage: Page;
};

export const navigationFixtures = {
  authenticatedPage: async ({ page }: FixtureContext, use: FixtureUse<Page>) => {
    await page.goto('/inventory.html');
    await use(page);
  },
};
