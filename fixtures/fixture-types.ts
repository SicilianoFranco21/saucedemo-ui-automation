import type { Page } from '@playwright/test';

export type FixtureContext = {
  page: Page;
  authenticatedPage: Page;
};

export type FixtureUse<T> = (value: T) => Promise<void>;
