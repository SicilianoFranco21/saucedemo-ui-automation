import type { Page } from '@playwright/test';

export abstract class BasePage {
  abstract readonly url: string;
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.url);
  }

  async reloadPage(): Promise<void> {
    await this.page.reload();
  }

  get currentUrl(): string {
    return this.page.url();
  }
}
